const axios = require("axios");

const predictSalary = async () => {
  try {
    const res = await axios.post("http://localhost:5000/predict", {
      userEmail: "test@gmail.com",
      Gender: "Male",
      Education_Level: "B.Tech",
      Qualification: "CS",
      Experience: 3,
      Category: "IT",
      JobRole: "Developer",
      PrimarySkill: "Python",
      Location: "Bangalore"
    });

    console.log("Predicted Salary:", res.data.predictedSalary);

  } catch (err) {
    console.log("Axios error:", err.message);
  }
};

predictSalary();