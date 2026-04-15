import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Charts from "./components/Charts";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");

  const [showProfile, setShowProfile] = useState(false);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [stats, setStats] = useState({
    totalPredictions: 0,
    avgSalary: 0,
    bestModelAccuracy: 0,
    bestModelName: ""
  });

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ Load Data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Total Predictions
    axios.get(`http://localhost:5000/stats/${userData.email}`)
      .then(res => {
        setStats(prev => ({
          ...prev,
          totalPredictions: res.data.totalPredictions || 0
        }));
      });

    // Average Salary
    axios.get(`http://localhost:5000/api/average-salary/${userData.email}`)
      .then(res => {
        setStats(prev => ({
          ...prev,
          avgSalary: res.data.average || 0
        }));
      });

    // Model Accuracy
    axios.get("http://localhost:5050/model-performance")
      .then(res => {
        const best = res.data.bestModel;

        setStats(prev => ({
          ...prev,
          bestModelAccuracy: best?.accuracy || 0,
          bestModelName: best?.name || "N/A"
        }));
      })
      .catch(() => {
        setStats(prev => ({
          ...prev,
          bestModelAccuracy: 0,
          bestModelName: "N/A"
        }));
      });

  }, []);

  return (
    <div className="home-container">

      {/* 🔥 NAVBAR */}
      <nav className="navbar">
        <h3 className="logo">Salary Predictor</h3>
<ul className="nav-links">
  <li>
    <a
      href="#home"
      className={active === "home" ? "active" : ""}
      onClick={() => setActive("home")}
    >
      Home
    </a>
  </li>
<li>
  <a
    onClick={() => {
      navigate("/predict");
      setActive("prediction");
    }}
    className={active === "prediction" ? "active" : ""}
  >
    Prediction
  </a>
</li>

  <li>
    <a
      href="#features"
      className={active === "features" ? "active" : ""}
      onClick={() => setActive("features")}
    >
      Features
    </a>
  </li>

  <li>
    <a
      href="#analytics"
      className={active === "analytics" ? "active" : ""}
      onClick={() => setActive("analytics")}
    >
      Analytics
    </a>
  </li>
</ul>

        <div className="right-section">
          <div
            className="profile-circle"
            onClick={() => setShowProfile(!showProfile)}
          >
            <span>{user?.name?.charAt(0) || "U"}</span>
          </div>

          {showProfile && (
            <div className="profile-card">
              <h4>Profile 👤</h4>
              <p><b>Name:</b> {user?.name}</p>
              <p><b>Email:</b> {user?.email}</p>
            </div>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* 🏠 HOME SECTION */}
      <section id="home" className="home">
        <div className="home-left">
          <h1 className="titlee">Know Your Worth 🚀</h1>
          <h2 className="subtitle">AI-Based Salary Prediction Platform</h2>

          <p className="desc">
            Predict employee salaries using machine learning models.
            Analyze trends based on experience and education.
          </p>

          <button className="arrow-circle" onClick={() => navigate("/predict")}>
  Start Prediction
  <span>→</span>
</button>
        </div>

        <div className="home-right">
          <img src="/salary.png" alt="salary" />
        </div>
      </section>

      {/* 🤖 PREDICTION */}
      <section id="prediction" className="section">
        <h2>Salary Prediction</h2>
      </section>

      {/* 🔲 FEATURES */}
      <section id="features" className="section">
      
{/* 🔲 PREDICTION DASHBOARD */}
<section id="dashboard" className="dashboard-section">

  <h2 className="dashboard-title">Prediction Dashboard</h2>
  <p className="dashboard-subtitle">Live insights & ML predictions</p>

  <div className="stats-container">

    <div className="stat-card" onClick={() => navigate("/my-history")}>
      <h3>Total Predictions</h3>
      <p>{stats.totalPredictions}</p>
      <div className="stat-icon">📊</div>
      <small className="stat-subtitle">Total predictions made</small>
    </div>

    <div className="stat-card" onClick={() => navigate("/average-salary")}>
      <h3>Average Salary</h3>
      <p>
        {stats.avgSalary
          ? `₹${(stats.avgSalary / 100000).toFixed(1)} LPA`
          : "Loading..."}
      </p>
      <div className="stat-icon">💰</div>
      <small className="stat-subtitle">Average predicted salary</small>
    </div>

    <div className="stat-card" onClick={() => navigate("/accuracy")}>
      <h3>Model Accuracy</h3>
      <p>
        {stats.bestModelAccuracy
          ? `${(stats.bestModelAccuracy * 100).toFixed(0)}%`
          : "Loading..."}
      </p>
      <div className="stat-icon">✅</div>
      <small className="stat-subtitle">{stats.bestModelName}</small>
    </div>

  </div>
</section>
</section>

    {/* 📊 ANALYTICS */}
<section id="analytics" className="analytics-section">
  <h2>Salary Insights</h2>
  <Charts />
</section>

    </div>
  );
}

export default Home;