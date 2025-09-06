import React, { useEffect, useState } from "react";
import API from "../services/api"; 

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorUsers, setErrorUsers] = useState("");
  const [errorLogs, setErrorLogs] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setErrorUsers("Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);



  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* Users Table */}
      <h3>Users</h3>
      {loadingUsers ? (
        <p>Loading users...</p>
      ) : errorUsers ? (
        <p style={{ color: "red" }}>{errorUsers}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

// Styles
const tableStyle = { borderCollapse: "collapse", width: "100%", backgroundColor: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)" };
const theadStyle = { background: "#f4f4f4" };
const thStyle = { padding: "10px", borderBottom: "2px solid #ddd", textAlign: "left" };
const tdStyle = { padding: "10px", borderBottom: "1px solid #ddd" };
