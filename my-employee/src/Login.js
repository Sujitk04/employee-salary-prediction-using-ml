import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      if (res.data.status === "Success") {
        const userData = res.data.user || res.data;

        localStorage.setItem("user", JSON.stringify(userData));

        navigate('/home', { replace: true });
      } else {
        setError(res.data);
      }

    } catch (err) {
      setError("Server error");
      console.log(err);
    }
  };

  return (
    <div className="login-container">

      {/* NAVBAR */}
      <nav className="login-navbar">
        <h3>User Login</h3>

        {/* 🔥 ADMIN BUTTON HIDDEN */}
        <button
          className="admin-btn"
          onClick={() => navigate('/adminlogin')}
          style={{ display: "none" }}
        >
          Admin Login
        </button>
      </nav>

      {/* LOGIN FORM */}
      <div className="auth-box">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;