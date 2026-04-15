
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function AverageSalary() {

  // ✅ SAFE INITIAL STATE (IMPORTANT)
  const [data, setData] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    total: 0,
    recent: []   // 🔥 prevents crash
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email) return;

    axios
      .get(`http://localhost:5000/api/average-salary/${email}`)
      .then((res) => {
        console.log("Average Page Data:", res.data);

        setData({
          average: res.data.average || 0,
          highest: res.data.highest || 0,
          lowest: res.data.lowest || 0,
          total: res.data.total || 0,
          recent: res.data.recent || []   // 🔥 SAFE
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="avg-container">

      <h1 className="title">Salary Insights📊 </h1>

     <div className="avg-card">
  <h2>Average Salary</h2>
  <p>₹{(data.average / 100000).toFixed(1)} LPA</p>
</div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-box">
          <h4>Highest</h4>
          <p>₹{data.highest}</p>
        </div>

        <div className="stat-box">
          <h4>Lowest</h4>
          <p>₹{data.lowest}</p>
        </div>

        <div className="stat-box">
          <h4>Total</h4>
          <p>{data.total}</p>
        </div>
      </div>

      {/* Recent Salaries */}
      <div className="recent-box">
        <h3>Recent Salaries</h3>

        <ul>
          {data.recent?.length > 0 ? (
            data.recent.map((s, i) => (
              <li key={i}>₹{s}</li>
            ))
          ) : (
            <p>No recent salaries</p>
          )}
        </ul>
      </div>

    </div>
  );
}

export default AverageSalary;