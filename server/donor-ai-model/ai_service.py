import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

from flask import Flask, request, jsonify

app = Flask(__name__)

model = joblib.load("xgboost_multi_dim_regression_v2.joblib")
training_columns = joblib.load("training_columns_v2.joblib")

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
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(port=5001)