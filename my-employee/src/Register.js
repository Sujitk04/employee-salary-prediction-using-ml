import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./style.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Email must be Gmail only");
      return;
    }

    setError("");

    axios.post('http://localhost:5000/register', {
      name,
      email,
      password,
      joinedDate: new Date().toISOString().split("T")[0] // ✅ ADDED ONLY THIS
    })
      .then(result => {
        console.log(result);
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  // Handle Enter key navigation
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form.elements, e.target);
      if (index === form.elements.length - 1) {
        handleRegister(e);
      } else {
        form.elements[index + 1].focus();
      }
    }
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleRegister}>
        <div className="auth-box">
          <h2>Register</h2>

          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleEnter}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnter}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p>
            Already have account? <Link to="/">Login</Link>
          </p>

          <button type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;