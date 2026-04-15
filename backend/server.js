const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { spawn } = require("child_process");

const User = require("./models/user");
const Prediction = require("./models/Prediction");

const app = express();

app.use(express.json());
app.use(cors());

/* ================= DATABASE ================= */
mongoose.connect("mongodb://127.0.0.1:27017/employee")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: "User",
      status: "Active"
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json("Incorrect password");

    res.json({
      status: "Success",
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADMIN LOGIN ================= */
app.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@gmail.com" && password === "admin123") {
    res.json({ token: "admin_login_success" });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
});

/* ================= USERS CRUD ================= */

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;
    const hash = await bcrypt.hash(password || "123456", 10);
    const user = await User.create({ name, email, role, status, password: hash });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= PREDICTION ================= */
app.post("/predict", async (req, res) => {
  console.log("🔥 /predict API HIT");
  try {
    const inputData = req.body;
    // Note: If "python" fails, change this to "python3"
    const pyProcess = spawn("python", ["salary_models/Prediction.py", JSON.stringify(inputData)]);

    let resultData = "";
    let errorData = "";

    pyProcess.stdout.on("data", (data) => { resultData += data.toString(); });
    pyProcess.stderr.on("data", (data) => { errorData += data.toString(); });

    pyProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("❌ Python Error:", errorData);
        return res.status(500).json({ error: errorData });
      }
      const salary = parseFloat(resultData.trim());
      if (isNaN(salary)) return res.status(500).json({ error: "Invalid prediction result" });

      const prediction = new Prediction({ ...inputData, predictedSalary: salary });
      await prediction.save();
      res.json({ predictedSalary: salary });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= NEW: USER DASHBOARD STATS ================= */

// 1. Fix for the 404 on /stats/:email
app.get("/stats/:email", async (req, res) => {
  try {
    const count = await Prediction.countDocuments({ userEmail: req.params.email });
    res.json({ totalPredictions: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/average-salary/:email", async (req, res) => {
  try {
    const history = await Prediction.find({
      userEmail: req.params.email
    });

    const salaries = history
      .map(p => Number(p.predictedSalary))
      .filter(v => !isNaN(v) && v > 0);

    const average =
      salaries.length > 0
        ? salaries.reduce((a, b) => a + b, 0) / salaries.length
        : 0;

    const highest = salaries.length ? Math.max(...salaries) : 0;
    const lowest = salaries.length ? Math.min(...salaries) : 0;

    const recent = salaries.slice(-5).reverse();

    res.json({
      average,
      highest,
      lowest,
      total: salaries.length,
      recent
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADMIN DASHBOARD & HISTORY ================= */

app.get("/admin/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    const predictions = await Prediction.find();
    const salaries = predictions.map(p => Number(p.predictedSalary)).filter(v => !isNaN(v));
    const avgSalary = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;

    res.json({ totalUsers, totalPredictions, avgSalary, predictions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/history/:email", async (req, res) => {
  try {
    const history = await Prediction.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});