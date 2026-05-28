import pandas as pd
import numpy as np
import joblib

print("Loading model...")

model = joblib.load("xgboost_multi_dim_regression.joblib")
training_columns = joblib.load("training_columns.joblib")

print("Model loaded successfully!")

target_cols = [
    "emotion_level",
    "professionalism_level",
    "storytelling_level",
    "urgency_level",
    "personalization_depth",
    "data_density",
    "message_length"
]

def predict_communication_profile(donor_data):
    donor_df = pd.DataFrame([donor_data])

    donor_encoded = pd.get_dummies(donor_df)

    for col in training_columns:
        if col not in donor_encoded.columns:
            donor_encoded[col] = 0

    donor_encoded = donor_encoded[training_columns]

    prediction = model.predict(donor_encoded)[0]
    prediction = np.clip(prediction, 1, 10)

    profile = {
        col: round(float(value), 2)
        for col, value in zip(target_cols, prediction)
    }

    return profile


new_donor = {
    "age": 45,
    "occupation": "CEO/Executive",
    "estimated_salary": 180000,
    "estimated_net_worth": 2500000,
    "donation_history_count": 6,
    "personality_cluster": "Analytical"
}

result = predict_communication_profile(new_donor)

print("\nPrediction Result:")
print(result)