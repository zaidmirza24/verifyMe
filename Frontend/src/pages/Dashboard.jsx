import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/verify/all");
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        } 
      } catch (err) {
        console.error("Failed to fetch verification requests:", err);
      }
    };
    fetchRequests();
  }, []);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleString() : "—";

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-700 text-lg">
          No verification request submitted yet.
        </p>
        <button
          onClick={() => navigate("/verify")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Start Verification
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Country</th>
              <th className="px-4 py-2 text-left">Document Type</th>
              <th className="px-4 py-2 text-left">AI Status</th>
              <th className="px-4 py-2 text-left">Confidence</th>
              <th className="px-4 py-2 text-left">Tampered?</th>
              <th className="px-4 py-2 text-left">Document</th>
              <th className="px-4 py-2 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((reqItem, index) => {

              const imageUrl = reqItem.documentPath
                ? `https://verifyme-uw2l.onrender.com/uploads/${reqItem.documentPath.replace(
                    /^uploads[\\/]/,
                    ""
                  )}`
                : null;

              return (
                <tr key={reqItem._id || index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{reqItem.status}</td>
                  <td className="px-4 py-2">{reqItem.country || "—"}</td>
                  <td className="px-4 py-2">{reqItem.documentType || "—"}</td>
                  <td className="px-4 py-2">{reqItem.aiResult?.status || "—"}</td>
                  <td className="px-4 py-2">
                    {reqItem.aiResult?.confidence
                      ? `${reqItem.aiResult.confidence}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {reqItem.aiResult
                      ? reqItem.aiResult.isTampered
                        ? "Yes"
                        : "No"
                      : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {imageUrl ? (
                      <button
                        onClick={() => setSelectedImage(imageUrl)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2">{formatDate(reqItem.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/verify")}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Verify Again
        </button>
      </div>

      {/* Modal for Image Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Document"
              className="max-h-[80vh] mx-auto rounded"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
