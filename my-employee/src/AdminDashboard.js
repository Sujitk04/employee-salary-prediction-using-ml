import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { NavLink } from "react-router-dom";
import "./AdminDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [data, setData] = useState({
    predictions: [],
    avgSalary: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/dashboard");

        console.log("API RESPONSE:", res.data);

        setData({
          predictions: res.data.predictions || [],
          avgSalary: res.data.avgSalary || 0,
          totalUsers: res.data.totalUsers || 0,
        });

      } catch (err) {
        console.log("Dashboard API Error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ SINGLE SOURCE
  const predictions = data.predictions || [];

  // ✅ SAFE SALARIES
  const salaries = predictions
    .map((p) => Number(p.predictedSalary))
    .filter((s) => !isNaN(s) && s > 0);

  // 🔥 CALCULATE HIGH & LOW HERE (IMPORTANT FIX)
  const highestSalary = salaries.length ? Math.max(...salaries) : 0;
  const lowestSalary = salaries.length ? Math.min(...salaries) : 0;

  // ================= BAR CHART =================
  const barData = {
    labels: ["2-4L", "4-6L", "6-8L", "8-10L", "10L+"],
    datasets: [
      {
        label: "Salary Distribution",
        data: [
          salaries.filter((s) => s >= 200000 && s < 400000).length,
          salaries.filter((s) => s >= 400000 && s < 600000).length,
          salaries.filter((s) => s >= 600000 && s < 800000).length,
          salaries.filter((s) => s >= 800000 && s < 1000000).length,
          salaries.filter((s) => s >= 1000000).length,
        ],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  // ================= PIE CHART =================
  const pieData = {
    labels: [
      "Entry Level",
      "Experience Level",
      "Intermediate Level",
      "Postgraduate Level",
    ],
    datasets: [
      {
        data: [
          salaries.filter((s) => s < 400000).length,
          salaries.filter((s) => s >= 400000 && s < 800000).length,
          salaries.filter((s) => s >= 800000 && s < 1200000).length,
          salaries.filter((s) => s >= 1200000).length,
        ],
        backgroundColor: ["#6366f1", "#f59e0b", "#10b981", "#ef4444"],
      },
    ],
  };

  return (
    <div className="admin-view">

      {/* SIDEBAR */}
      <aside className="sidebar-container">
        <div className="sidebar-profile">
          <div className="avatar">👤</div>
          <h3>Admin</h3>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admindashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/manage-users" className="nav-link">Manage Users</NavLink>
          <NavLink to="/reports" className="nav-link">Reports</NavLink>
          <NavLink to="/settings" className="nav-link">Settings</NavLink>
        </nav>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="content-area">

        <header className="content-header">
          <h2>Admin Dashboard</h2>
        </header>

        <div className="scrollable-content">

          {/* STATS */}
          <section className="stats-container">

            <div className="stat-item c1">
              <span>Avg Salary</span>
              <h2>₹{(data.avgSalary || 0).toLocaleString()}</h2>
            </div>

            <div className="stat-item c2">
              <span>Highest Salary</span>
              <h2>₹{highestSalary.toLocaleString()}</h2>
            </div>

            <div className="stat-item c3">
              <span>Lowest Salary</span>
              <h2>₹{lowestSalary.toLocaleString()}</h2>
            </div>

            <div className="stat-item c4">
              <span>Total Users</span>
              <h2>{data.totalUsers || 0}</h2>
            </div>

          </section>

          {/* CHARTS */}
          <section className="charts-container">

            <div className="chart-card">
              <h4>Salary Distribution</h4>
              <Bar data={barData} options={{ responsive: true }} />
            </div>

            <div className="chart-card">
              <h4>User Demographics</h4>
              <Pie data={pieData} options={{ responsive: true }} />
            </div>

          </section>

          {/* TABLE */}
          <section className="table-container">

            <h4>Recent Predictions</h4>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Salary</th>
                </tr>
              </thead>

              <tbody>
                {data.predictions
                  ?.slice(-5)
                  .reverse()
                  .map((p, i) => (
                    <tr key={i}>
                      <td>{p.userEmail || "N/A"}</td>
                      <td>{p.JobRole || "N/A"}</td>
                      <td>{p.Location || "N/A"}</td>
                      <td className="bold-price">
                        ₹{Number(p.predictedSalary || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>

          </section>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;