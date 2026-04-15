import sys
import json
import pickle
import numpy as np
import os

# Get absolute path to the directory where this script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model.pkl")
encoders_path = os.path.join(BASE_DIR, "encoders.pkl")

try:
    model = pickle.load(open(model_path, "rb"))
    encoders = pickle.load(open(encoders_path, "rb"))
except Exception as e:
    print(f"Error loading files: {e}")
    sys.exit(1)

input_data = json.loads(sys.argv[1])

try:
    encoded_input = [
        encoders['Gender'].transform([input_data['Gender']])[0],
        encoders['Education_Level'].transform([input_data['Education_Level']])[0],
        encoders['Qualification'].transform([input_data['Qualification']])[0],
        int(input_data['Experience']),
        encoders['Category'].transform([input_data['Category']])[0],
        encoders['JobRole'].transform([input_data['JobRole']])[0],
        encoders['PrimarySkill'].transform([input_data['PrimarySkill']])[0],
        encoders['Location'].transform([input_data['Location']])[0] if input_data['Location'] else 0
    ]

    encoded_input = np.array(encoded_input).reshape(1, -1)
    predicted_salary = model.predict(encoded_input)[0]
    
    # Print ONLY the number so Node.js can parse it easily
    print(predicted_salary)

except Exception as e:
    print(f"Prediction Error: {e}")
    sys.exit(1)