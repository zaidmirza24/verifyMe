import React, { useEffect, useState } from "react";
import API from "../services/api"; 
export default function InspectorDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Fetch pending requests
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await API.get("/inspector/pending");
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load pending requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  // Handle Approve/Reject
  const handleDecision = async (id, decision) => {
    try {
      await API.post(`/inspector/${id}/decision`, { decision });
      setRequests((prev) => prev.filter((req) => req._id !== id)); // Remove from list
    } catch (err) {
      console.error(err);
      alert("Failed to update request.");
    }
  };

  const handleOpenDialog = (url) => {
    setSelectedDoc(url);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedDoc(null);
    setOpenDialog(false);
  };

  if (loading) return <p>Loading pending requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (requests.length === 0) return <p>No pending manual verifications.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inspector Dashboard</h2>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ background: "#f4f4f4" }}>
          <tr>
            <th style={thStyle}>User Email</th>
            <th style={thStyle}>Document Type</th>
            <th style={thStyle}>Country</th>
            <th style={thStyle}>Submitted At</th>
            <th style={thStyle}>AI Status</th>
            <th style={thStyle}>Confidence</th>
            <th style={thStyle}>View Document</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td style={tdStyle}>{req.user?.email || "—"}</td>
              <td style={tdStyle}>{req.documentType || "—"}</td>
              <td style={tdStyle}>{req.country || "—"}</td>
              <td style={tdStyle}>
                {new Date(req.createdAt).toLocaleString()}
              </td>
              <td style={tdStyle}>{req.aiResult?.status || "—"}</td>
              <td style={tdStyle}>
                {req.aiResult?.confidence
                  ? `${req.aiResult.confidence}%`
                  : "—"}
              </td>
              <td style={tdStyle}>
                {req.documentUrl ? (
                  <button
                    onClick={() => handleOpenDialog(req.documentUrl)}
                    style={viewBtn}
                  >
                    View
                  </button>
                ) : (
                  "—"
                )}
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleDecision(req._id, "approved")}
                  style={approveBtn}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req._id, "rejected")}
                  style={rejectBtn}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog Modal */}
      {openDialog && (
        <div style={overlayStyle} onClick={handleCloseDialog}>
          <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
            <button style={closeBtn} onClick={handleCloseDialog}>
              ✖
            </button>
            {selectedDoc && (
              <img
                src={selectedDoc}
                alt="Document"
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const approveBtn = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  marginRight: "5px",
  cursor: "pointer",
  borderRadius: "4px",
};

const rejectBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

const viewBtn = {
  background: "#007bff",
  color: "#fff",
  padding: "5px 10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const dialogStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  position: "relative",
  maxWidth: "90%",
  maxHeight: "90%",
  overflow: "auto",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};
