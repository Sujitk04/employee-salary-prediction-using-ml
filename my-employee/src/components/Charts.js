import React, { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import "./Charts.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register all required elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
);

const Charts = () => {
  const [activeChart, setActiveChart] = useState("bar");

  // 🔵 Bar Chart (Salary by Role)
  const salaryByRole = {
    labels: ["Developer", "Data Scientist", "Tester"],
    datasets: [
      {
        label: "Salary",
        data: [40000, 60000, 30000],
        backgroundColor: ["#4facfe", "#00f2fe", "#43e97b"],
        borderRadius: 8,
      },
    ],
  };

  // 🟢 Line Chart (Experience vs Salary)
  const experienceData = {
    labels: [1, 2, 3, 4, 5],
    datasets: [
      {
        label: "Salary Growth",
        data: [20000, 30000, 45000, 60000, 80000],
        borderColor: "#4facfe",
        backgroundColor: "#4facfe33",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 🟣 Pie Chart (Skills)
  const skillsData = {
    labels: ["Python", "Java", "ML", "Others"],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: [
          "#667eea",
          "#764ba2",
          "#43e97b",
          "#f093fb",
        ],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">📊 Analytics Dashboard</h2>

      {/* 🔥 Tabs */}
      <div className="chart-tabs">
        <button
          className={activeChart === "bar" ? "active" : ""}
          onClick={() => setActiveChart("bar")}
        >
          Salary
        </button>

        <button
          className={activeChart === "line" ? "active" : ""}
          onClick={() => setActiveChart("line")}
        >
          Experience
        </button>

        <button
          className={activeChart === "pie" ? "active" : ""}
          onClick={() => setActiveChart("pie")}
        >
          Skills
        </button>
      </div>

      {/* 🔥 Chart Display */}
      <div className="charts-box">
        {activeChart === "bar" && <Bar key="bar" data={salaryByRole} />}
        {activeChart === "line" && <Line key="line" data={experienceData} />}
        {activeChart === "pie" && <Pie key="pie" data={skillsData} />}
      </div>
    </div>
  );
};

export default Charts;