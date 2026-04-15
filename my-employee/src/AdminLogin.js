import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Home.css'; 

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post("http://localhost:5000/adminlogin", {
        email,
        password
      });
        console.log("Login response:", res.data);

      if (res.data.token) {

        // store token
        localStorage.setItem("adminToken", res.data.token);

        // redirect dashboard
        navigate("/admindashboard");

      }

    } catch (error) {

      alert("Invalid admin login");

    }
  };

 return (
  <div className="admin-login-container">

    <div className="admin-login-box">

      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  </div>
);
}

export default AdminLogin;