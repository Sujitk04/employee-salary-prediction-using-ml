import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate(); // ✅ added

  // 🔹 Fetch users from backend
 useEffect(() => {
  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  };

  fetchUsers(); // first load

  const interval = setInterval(fetchUsers, 3000); // every 3 sec

  return () => clearInterval(interval); // cleanup
}, []);
  // 🔹 Delete user
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((err) => console.log(err));
  };

  // 🔹 Navigate to Add User page
  const handleAddUser = () => {
    navigate("/add-user"); // ✅ route path
  };

  // 🔹 Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-users-container">
      
      {/* Header */}
      <div className="header">
        <h2>Manage Users</h2>
       <Link to="/register">
        <button className="add-btn" onClick={handleAddUser}>
          + Add User
        </button>
      </Link>
       
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {/* Table */}
      <table className="user-table">
       <thead>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Role</th>
    <th>Status</th>
    <th>Joined Date</th>
    <th>Actions</th>
  </tr>
</thead>

       <tbody>
  {filteredUsers.length > 0 ? (
    filteredUsers.map((user) => (
      <tr key={user._id}>
        <td>{user.name || "N/A"}</td>
        <td>{user.email || "N/A"}</td>
        <td>{user.role || "User"}</td>
        <td>{user.status || "Active"}</td>
        <td>
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </td>
        <td>
          <button className="edit-btn">Edit</button>
          <button
            className="delete-btn"
            onClick={() => handleDelete(user._id)}
          >
            Delete
          </button>
          <button className="block-btn">Block</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8">No users found</td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  );
}

export default ManageUsers;