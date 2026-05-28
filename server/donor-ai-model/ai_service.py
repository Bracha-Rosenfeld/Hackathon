import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from flask import Flask, request, jsonify

app = Flask(__name__)

model = joblib.load("xgboost_multi_dim_regression.joblib")
training_columns = joblib.load("training_columns.joblib")

TARGET_COLS = [
    "emotion_level", "professionalism_level", "storytelling_level",
    "urgency_level", "personalization_depth", "data_density", "message_length"
]

REQUIRED_FIELDS = ["age", "occupation", "estimated_salary", "estimated_net_worth",
                   "donation_history_count", "personality_cluster"]

@app.route("/predict", methods=["POST"])
def predict():
    donor = request.get_json()

    missing = [f for f in REQUIRED_FIELDS if f not in donor]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    df = pd.get_dummies(pd.DataFrame([donor]))
    for col in training_columns:
        if col not in df.columns:
            df[col] = 0
    df = df[training_columns]

    prediction = np.clip(model.predict(df)[0], 1, 10)
    profile = {col: round(float(v), 2) for col, v in zip(TARGET_COLS, prediction)}

    return jsonify({"success": True, "communication_profile": profile})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5001)
