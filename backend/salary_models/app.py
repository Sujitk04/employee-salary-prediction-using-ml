from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app)

print("🔥🔥🔥 CORRECT APP RUNNING 🔥🔥🔥")

# =========================
# 🔹 LOAD MODEL (FOR PREDICT ONLY)
# =========================
model = pickle.load(open("model.pkl", "rb"))
encoders = pickle.load(open("encoders.pkl", "rb"))

# =========================
# 🔹 LOAD DATASET
# =========================
df = pd.read_csv("salary_dataset.csv")

X = df.drop(columns=["Salary"])
y = df["Salary"]

# 🔥 FIX: Fresh encoding (NO encoder error)
for col in X.select_dtypes(include=['object']).columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])

# 🔥 SPLIT DATA (REAL ACCURACY)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# 🔹 TRAIN MODELS (ONCE)
# =========================
models = {
    "Decision Tree": DecisionTreeRegressor(),
    "Random Forest": RandomForestRegressor(),
    "XGBoost": XGBRegressor()
}

trained_models = {}

for name, m in models.items():
    m.fit(X_train, y_train)   # ✅ TRAIN ONLY TRAIN DATA
    trained_models[name] = m

print("✅ Models trained successfully")

# =========================
# 🔹 TEST ROUTES
# =========================
@app.route("/")
def home():
    return "API is running 🚀"

@app.route("/hello")
def hello():
    return "HELLO BRO WORKING 😎"

# =========================
# 🔹 PREDICT API (NO CHANGE)
# =========================
import time

@app.route("/predict", methods=["POST"])
def predict():
    start = time.time()

    try:
        data = request.get_json()

        gender = encoders["Gender"].transform([data["Gender"]])[0]
        edu = encoders["Education_Level"].transform([data["Education_Level"]])[0]
        qual = encoders["Qualification"].transform([data["Qualification"]])[0]
        category = encoders["Category"].transform([data["Category"]])[0]
        jobrole = encoders["JobRole"].transform([data["JobRole"]])[0]
        skill = encoders["PrimarySkill"].transform([data["PrimarySkill"]])[0]
        location = encoders["Location"].transform([data["Location"]])[0]
        experience = int(data["Experience"])

        features = np.array([[gender, edu, qual, experience,
                              category, jobrole, skill, location]])

        prediction = model.predict(features)

        end = time.time()
        print("⏱ Time taken:", end - start)

        return jsonify({
            "salary": int(prediction[0])
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)})
    

# =========================
# 🔹 MODEL PERFORMANCE API (FIXED)
# =========================
@app.route("/model-performance", methods=["GET"])
def model_performance():
    try:
        results = []

        for name, model in trained_models.items():

            y_pred = model.predict(X_test)

            acc = r2_score(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))

            rmse_scaled = rmse / (y_test.max() - y_test.min())

            results.append({
                "name": name,
                "accuracy": round(acc, 4),
                "rmse": round(rmse_scaled, 4)
            })

        best_model = max(results, key=lambda x: x["accuracy"])

        return jsonify({
            "allModels": results,
            "bestModel": best_model
        })

    except Exception as e:
        return jsonify({"error": str(e)})
# =========================
# 🔹 RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5050, debug=True)