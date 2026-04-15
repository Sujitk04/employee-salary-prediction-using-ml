import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor

# Load dataset
data = pd.read_csv("salary_dataset.csv")

# Encoders
encoders = {}
categorical_cols = [
    "Gender",
    "Education_Level",
    "Qualification",
    "Category",
    "JobRole",
    "PrimarySkill",
    "Location"
]

# Apply Label Encoding
for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    encoders[col] = le

# Features and Target
X = data[[
    "Gender",
    "Education_Level",
    "Qualification",
    "Experience",
    "Category",
    "JobRole",
    "PrimarySkill",
    "Location"
]]

y = data["Salary"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Accuracy
print("Model Score:", model.score(X_test, y_test))

# Save model
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(encoders, open("encoders.pkl", "wb"))

print("✅ Model trained & saved successfully")