import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

from flask import Flask, request, jsonify

app = Flask(__name__)

# =========================================================
# Communication profile model - existing model
# =========================================================
model = joblib.load("xgboost_multi_dim_regression_v3.joblib")
training_columns = joblib.load("training_columns_v3.joblib")

# =========================================================
# Donation capacity model V3 - new model
# =========================================================
capacity_model = joblib.load("donation_capacity_model_v3.joblib")
capacity_training_columns = joblib.load("donation_capacity_columns_v3.joblib")

TARGET_COLS = [
    "emotion_level",
    "professionalism_level",
    "storytelling_level",
    "urgency_level",
    "personalization_depth",
    "data_density",
    "message_length"
]

DEFAULT_FIELDS = {
    "age_estimate": 0,

    "emailDomainType": "unknown",
    "city_tier": "unknown",

    "hasLinkedin": 0,
    "hasBusinessEmail": 0,
    "hasVerifiedEmail": 0,

    "followers": 0,
    "connections": 0,

    "isStudent": 0,
    "isFounder": 0,
    "isCEO": 0,
    "isCLevel": 0,
    "isExecutive": 0,
    "isManager": 0,
    "isDirector": 0,
    "isOwner": 0,

    "isTechRelated": 0,
    "isDataRole": 0,
    "isFinanceRelated": 0,
    "isRealEstateRelated": 0,
    "isMedicalRelated": 0,
    "isLegalRelated": 0,
    "isPublicSector": 0,
    "isNonProfitRelated": 0,

    "hasAcademicEducation": 0,
    "hasEliteEducation": 0,
    "isComputerScience": 0,

    "hasCompanyWebsite": 0,
    "hasCompanyLinkedin": 0,
    "hasLargeCompany": 0,
    "hasStartupSignal": 0,
    "hasStrongProfessionalPresence": 0,

    "companySizeBucket": "unknown",

    "seniority_level": 0,
    "wealth_proxy_score": 0,
    "professional_presence_score": 0,
    "data_confidence_score": 0
}


def prepare_donor_input(donor):
    """
    Prepares input for the existing communication profile model.
    """

    if donor is None:
        donor = {}

    full_donor = DEFAULT_FIELDS.copy()
    full_donor.update(donor)

    df = pd.DataFrame([full_donor])

    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns
    categorical_cols = df.select_dtypes(include=["object"]).columns

    for col in numeric_cols:
        df[col] = df[col].fillna(0)

    for col in categorical_cols:
        df[col] = df[col].fillna("unknown")

    df_encoded = pd.get_dummies(df, dummy_na=True)

    for col in training_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    df_encoded = df_encoded[training_columns]

    return df_encoded


# =========================================================
# Donation Capacity V3 helpers
# =========================================================

def score_to_amounts(score, donor=None):
    """
    Converts donation capacity score to donation amount options.
    The model predicts ability/potential, and this function maps it
    to controlled donation amounts.
    """
    if donor is None:
        donor = {}

    is_student = donor.get("isStudent", 0) == 1

    if is_student:
        if score >= 7:
            return [100, 150, 250]
        return [50, 80, 120]

    if score >= 9.2:
        return [1000, 1800, 3000]
    elif score >= 8.3:
        return [750, 1200, 1800]
    elif score >= 7.2:
        return [500, 750, 1200]
    elif score >= 6.0:
        return [360, 500, 750]
    elif score >= 4.5:
        return [180, 250, 360]
    else:
        return [80, 120, 180]


def prepare_donation_input(donor):
    """
    Prepares input for the Donation Capacity Model V3.
    V3 predicts one value: donation_capacity_score.
    """

    if donor is None:
        donor = {}

    default_donation_fields = {
        "emailDomainType": "unknown",
        "city_tier": "unknown",

        "hasLinkedin": 0,
        "followers": 0,
        "connections": 0,

        "isStudent": 0,
        "isCEO": 0,
        "isFounder": 0,
        "isOwner": 0,
        "isCLevel": 0,
        "isExecutive": 0,
        "isManager": 0,

        "isTechRelated": 0,
        "isFinanceRelated": 0,
        "isRealEstateRelated": 0,
        "isMedicalRelated": 0,
        "isPublicSector": 0,

        "seniority_level": 0,
        "wealth_proxy_score": 0,
        "professional_presence_score": 0,
        "data_confidence_score": 0
    }

    full_donor = default_donation_fields.copy()
    full_donor.update(donor)

    df = pd.DataFrame([full_donor])

    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns
    categorical_cols = df.select_dtypes(include=["object"]).columns

    for col in numeric_cols:
        df[col] = df[col].fillna(0)

    for col in categorical_cols:
        df[col] = df[col].fillna("unknown")

    df_encoded = pd.get_dummies(df)

    for col in capacity_training_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    df_encoded = df_encoded[capacity_training_columns]
    df_encoded = df_encoded.astype(float)

    return df_encoded


# =========================================================
# Routes
# =========================================================

@app.route("/predict", methods=["POST"])
def predict():
    donor = request.get_json()

    try:
        df = prepare_donor_input(donor)

        prediction = model.predict(df)[0]
        prediction = np.clip(prediction, 1, 10)
        prediction = np.round(prediction, 2)

        profile = {
            col: round(float(v), 2)
            for col, v in zip(TARGET_COLS, prediction)
        }

        return jsonify({
            "success": True,
            "communication_profile": profile
        })

    except Exception as e:
        print("❌ PREDICT ERROR:", str(e), flush=True)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/predict-donation", methods=["POST"])
def predict_donation():
    donor = request.get_json()

    try:
        df = prepare_donation_input(donor)

        prediction = capacity_model.predict(df)[0]

        capacity_score = round(float(prediction), 2)
        capacity_score = max(1, min(10, capacity_score))

        final_amounts = score_to_amounts(capacity_score, donor)

        return jsonify({
            "success": True,
            "donationPrediction": {
                "capacity_score": capacity_score,
                "safe_amount": int(final_amounts[0]),
                "stretch_amount": int(final_amounts[1]),
                "visionary_amount": int(final_amounts[2]),
                "threePriceOptions": [
                    int(final_amounts[0]),
                    int(final_amounts[1]),
                    int(final_amounts[2])
                ]
            }
        })

    except Exception as e:
        print("❌ DONATION PREDICT ERROR:", str(e), flush=True)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(port=5001)
