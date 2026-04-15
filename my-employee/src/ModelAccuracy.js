import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ModelAccuracy.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";

function ModelAccuracy() {
  const [modelData, setModelData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5050/model-performance")
      .then(res => {
        console.log("API DATA:", res.data);
        setModelData(res.data.allModels || []);
      })
      .catch(err => console.error(err));
  }, []);

  const maxAccuracy = Math.max(...modelData.map(m => m.accuracy || 0));

  return (
    <div className="model-container">

      <h2>MODEL PERFORMANCE COMPARISON</h2>
      <p>Comparing ML Models across Accuracy and RMSE</p>

      {/* CHART FIXED */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={modelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="accuracy" fill="#f59e0b" name="Accuracy (R²)">
              <LabelList dataKey="accuracy" position="top" />
            </Bar>

            <Bar dataKey="rmse" fill="#3b82f6" name="RMSE">
              <LabelList dataKey="rmse" position="top" />
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <table className="model-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Accuracy</th>
            <th>RMSE</th>
          </tr>
        </thead>

        <tbody>
          {modelData.map((model, idx) => (
            <tr
              key={idx}
              className={model.accuracy === maxAccuracy ? "best-model" : ""}
            >
              <td>{model.name}</td>
              <td>{model.accuracy}</td>
              <td>{model.rmse}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="note">
        Note: Comparison of ML model performance for salary prediction
      </p>

    </div>
  );
}

export default ModelAccuracy;