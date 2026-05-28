import joblib
import numpy as np

model = joblib.load("xgboost_multi_dim_regression.joblib")
cols = joblib.load("training_columns.joblib")

print("=== TRAINING COLUMNS ===")
print(list(cols))

print("\n=== MODEL TYPE ===")
print(type(model).__name__)

if hasattr(model, "estimators_"):
    print("\n=== SUB-ESTIMATORS (one per target) ===")
    for i, est in enumerate(model.estimators_):
        print(f"  [{i}]", type(est).__name__)
        if hasattr(est, "n_features_in_"):
            print(f"       n_features_in: {est.n_features_in_}")

if hasattr(model, "get_params"):
    print("\n=== MODEL PARAMS ===")
    for k, v in model.get_params().items():
        print(f"  {k}: {v}")
