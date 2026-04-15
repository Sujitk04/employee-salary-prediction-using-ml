const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  Gender: String,
  Education_Level: String,
  Qualification: String,
  Experience: Number,
  Category: String,
  JobRole: String,
  PrimarySkill: String,
  Location: String,
  predictedSalary: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", predictionSchema);