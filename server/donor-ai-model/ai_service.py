import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

from flask import Flask, request, jsonify

app = Flask(__name__)

model = joblib.load("xgboost_multi_dim_regression_v3.joblib")
training_columns = joblib.load("training_columns_v3.joblib")

donation_model = joblib.load("donation_amount_model_v2.joblib")
donation_training_columns = joblib.load("donation_amount_training_columns_v2.joblib")
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
    מקבלת תורם עם חלק מהשדות,
    משלימה שדות חסרים,
    ומחזירה DataFrame שמתאים בדיוק לעמודות שהמודל למד.
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

def round_to_display_amount(x):
    """
    מעגל את תחזית המודל לסכומי תרומה יפים להצגה בדף נחיתה.
    """
    if x <= 25:
        return 20
    elif x <= 45:
        return 36
    elif x <= 70:
        return 50
    elif x <= 120:
        return 100
    elif x <= 220:
        return 180
    elif x <= 320:
        return 250
    elif x <= 450:
        return 360
    elif x <= 650:
        return 500
    elif x <= 900:
        return 750
    elif x <= 1300:
        return 1000
    elif x <= 1800:
        return 1500
    elif x <= 2500:
        return 2000
    else:
        return 3000


DONATION_AMOUNTS = [
    20, 36, 50, 80, 100, 120, 150, 180,
    250, 300, 360, 500, 650, 750, 1000,
    1200, 1500, 1800, 2000, 2500, 3000
]


def nearest_amount(x):
    return min(DONATION_AMOUNTS, key=lambda amount: abs(amount - x))


def build_three_close_options(prediction):
    """
    מקבלת חיזוי גולמי של המודל ומחזירה 3 סכומים קרובים והגיוניים.
    """

    base = prediction[1]

    safe_raw = base * 0.7
    stretch_raw = base
    visionary_raw = base * 1.35

    safe = nearest_amount(safe_raw)
    stretch = nearest_amount(stretch_raw)
    visionary = nearest_amount(visionary_raw)

    amounts = sorted(list(set([safe, stretch, visionary])))

    while len(amounts) < 3:
        last = amounts[-1]
        next_options = [x for x in DONATION_AMOUNTS if x > last]

        if next_options:
            amounts.append(next_options[0])
        else:
            break

    return amounts[:3]


def prepare_donation_input(donor):
    """
    מקבלת תורם עם חלק מהשדות,
    משלימה שדות חסרים,
    ומחזירה DataFrame שמתאים בדיוק לעמודות שמודל התרומות למד.
    """

    if donor is None:
        donor = {}

    default_donation_fields = {
        "emailDomainType": "unknown",
        "city_tier": "unknown",
        "companySizeBucket": "unknown",

        "hasLinkedin": 0,
        "hasBusinessEmail": 0,
        "hasVerifiedEmail": 0,

        "followers": 0,
        "connections": 0,

        "isStudent": 0,
        "isCEO": 0,
        "isExecutive": 0,
        "isManager": 0,
        "isTechRelated": 0,
        "isFinanceRelated": 0,

        "seniority_level": 0,
        "wealth_proxy_score": 0,
        "professional_presence_score": 0,
        "data_confidence_score": 0,
        "financialStabilityScore": 0
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

    for col in donation_training_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    df_encoded = df_encoded[donation_training_columns]
    df_encoded = df_encoded.astype(float)

    return df_encoded
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

        prediction = donation_model.predict(df)[0]

        final_amounts = build_three_close_options(prediction)

        return jsonify({
            "success": True,
            "donationPrediction": {
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