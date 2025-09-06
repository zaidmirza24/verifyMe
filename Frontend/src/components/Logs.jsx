import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/admin/audit");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load audit logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audit Logs</h2>

      {loading ? (
        <p>Loading audit logs...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Actor</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td style={tdStyle}>{log.actor?.email || "—"}</td>
                <td style={tdStyle}>{log.actor?.role || "—"}</td>
                <td style={tdStyle}>{log.action}</td>
                <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles
const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};
const theadStyle = { background: "#f4f4f4" };
const thStyle = { padding: "10px", borderBottom: "2px solid #ddd", textAlign: "left" };
const tdStyle = { padding: "10px", borderBottom: "1px solid #ddd" };
