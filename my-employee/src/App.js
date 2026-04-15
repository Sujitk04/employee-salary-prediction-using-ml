import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import NewPrediction from "./NewPrediction";
import AdminLogin from "./AdminLogin";
import MyPredictionHistory from "./MyPredictionHistory";
import AverageSalary from "./AverageSalary";
import AdminDashboard from "./AdminDashboard";
import ModelAccuracy from "./ModelAccuracy";
import ManageUsers from "./ManageUsers";


// 🔐 Protected Route for USER
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" />;
};

// 🔐 Protected Route for ADMIN
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? children : <Navigate to="/adminlogin" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* USER PROTECTED ROUTES */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/predict" element={<ProtectedRoute><NewPrediction /></ProtectedRoute>} />
        <Route path="/my-history" element={<ProtectedRoute><MyPredictionHistory /></ProtectedRoute>} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route 
          path="/admindashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />

        <Route 
          path="/manage-users" 
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          } 
        />

        <Route 
          path="/accuracy" 
          element={
            <AdminProtectedRoute>
              <ModelAccuracy />
            </AdminProtectedRoute>
          } 
        />

        <Route 
          path="/average-salary" 
          element={
            <AdminProtectedRoute>
              <AverageSalary />
            </AdminProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;