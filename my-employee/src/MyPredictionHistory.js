import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

function MyPredictionHistory() {
  const [history, setHistory] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/history/${user.email}`)
        .then((res) => {
          console.log("HISTORY DATA 👉", res.data);
          setHistory(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

return (
  <div className="history-wrapper">
    <h2 className="history-title">📊 My Prediction History</h2>

    <div className="history-card">
      <p className="total">Total Predictions: {history.length}</p>

      <table className="history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date & Time</th>
            <th>Role</th>
            <th>Experience</th>
            <th>Salary (INR)</th>
          </tr>
        </thead>

        <tbody>
          {history.length > 0 ? (
            history.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>

                <td>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "N/A"}
                </td>

                <td>{item.JobRole || "N/A"}</td>

                <td>{item.Experience} yrs</td>

                <td className="salary">
                  ₹ {Number(item.predictedSalary).toLocaleString("en-IN")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                No history found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default MyPredictionHistory;