import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";

const NewPrediction = () => {

  const [form, setForm] = useState({
    Gender: "",
    Education_Level: "",
    Qualification: "",
    Experience: "",
    Category: "",
    JobRole: "",
    PrimarySkill: "",
    Location: ""
  });

  const [salary, setSalary] = useState("");

  const handleNewPrediction = () => {
    setForm({
      Gender: "",
      Education_Level: "",
      Qualification: "",
      Experience: "",
      Category: "",
      JobRole: "",
      PrimarySkill: "",
      Location: ""
    });

    setSalary("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 PREDICT FUNCTION (FIXED)
  const handlePredict = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User not logged in");
        return;
      }

      console.log("📤 Sending Data:", {
        ...form,
        userEmail: user.email
      });

      const response = await axios.post(
        "http://localhost:5000/predict",
        {
          ...form,
          userEmail: user.email
        }
      );

      console.log("✅ Response:", response.data);

      const predictedSalary = response.data.predictedSalary;

      // ✅ Update UI
      setSalary(predictedSalary);

      // ✅ Save count
      let count = localStorage.getItem("predictionCount") || 0;
      count = parseInt(count) + 1;
      localStorage.setItem("predictionCount", count);

      // ✅ Save last salary
      localStorage.setItem("lastSalary", predictedSalary);

      // ✅ Save history
      let history = JSON.parse(localStorage.getItem("history")) || [];
      history.push({ ...form, salary: predictedSalary });
      localStorage.setItem("history", JSON.stringify(history));

    } catch (err) {
      console.error("❌ Error:", err);

      if (err.response) {
        console.error("❌ Server Error:", err.response.data);
      }

      alert("Prediction failed");
    }
  };

  // Qualification options
  const qualificationOptions = {
    Diploma: ["Diploma in Computer Engineering", "Diploma in IT"],
    Bachelor: ["BCA", "B.Tech / B.E", "B.Sc", "BBA", "B.Com"],
    Master: ["MCA", "MSc CS", "MBA", "M.E/M.Tech"],
  };

  // Job + Skill mapping
  const jobSkillMap = {
    IT: {
      roles: [
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Data Scientist",
        "Machine Learning Engineer",
        "DevOps Engineer"
      ],
      skills: [
        "Java",
        "Python",
        "JavaScript",
        "React",
        "Node.js",
        "SQL",
        "MongoDB",
        "AWS"
      ]
    },
    NON_IT: {
      roles: [
        "HR Executive",
        "Finance Analyst",
        "Marketing Executive",
        "Sales Manager"
      ],
      skills: [
        "Communication",
        "Excel",
        "Financial Analysis",
        "Digital Marketing"
      ]
    }
  };

  return (
    <div className="prediction-wrapper">
      <div className="prediction-card">

        <h1 className="title">💼 Salary Prediction</h1>

        <form onSubmit={handlePredict} className="form-grid">

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select name="Gender" value={form.Gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Education */}
          <div className="form-group">
            <label>Education Level</label>
            <select name="Education_Level" value={form.Education_Level} onChange={handleChange} required>
              <option value="">Select Education</option>
              <option>Diploma</option>
              <option>Bachelor</option>
              <option>Master</option>
            </select>
          </div>

          {/* Qualification */}
          <div className="form-group">
            <label>Qualification</label>
            <select name="Qualification" value={form.Qualification} onChange={handleChange} required>
              <option value="">Select Qualification</option>
              {form.Education_Level &&
                qualificationOptions[form.Education_Level].map((course, i) => (
                  <option key={i}>{course}</option>
                ))}
            </select>
          </div>

          {/* Experience */}
          <div className="form-group">
            <label>Experience (Years)</label>
            <input
              type="number"
              name="Experience"
              value={form.Experience}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select name="Category" value={form.Category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="IT">IT</option>
              <option value="NON_IT">Non-IT</option>
            </select>
          </div>

          {/* Job Role */}
          <div className="form-group">
            <label>Job Role</label>
            <select name="JobRole" value={form.JobRole} onChange={handleChange} required>
              <option value="">Select Role</option>
              {form.Category &&
                jobSkillMap[form.Category].roles.map((role, i) => (
                  <option key={i}>{role}</option>
                ))}
            </select>
          </div>

          {/* Skill */}
          <div className="form-group">
            <label>Primary Skill</label>
            <select name="PrimarySkill" value={form.PrimarySkill} onChange={handleChange} required>
              <option value="">Select Skill</option>
              {form.Category &&
                jobSkillMap[form.Category].skills.map((skill, i) => (
                  <option key={i}>{skill}</option>
                ))}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <select name="Location" value={form.Location} onChange={handleChange} required>
              <option value="">Select Location</option>
              <option>Chennai</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Pune</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="predict-btn">
            Predict Salary
          </button>

        </form>

        {/* Result */}
        {salary && (
          <div className="result-box">
            <h3>Predicted Salary</h3>
            <p>₹ {(Math.round(salary) / 100000).toFixed(1)} Lakhs per annum</p>

            <button className="new-btn" onClick={handleNewPrediction}>
              + New Prediction
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewPrediction;