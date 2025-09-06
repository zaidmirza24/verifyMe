import { useState } from "react";
import api from "../services/api"; 

export default function VerifyUpload() {
  const [country, setCountry] = useState("");
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!country || !docType || !file) {
      return alert("All fields are required!");
    }

    const formData = new FormData();
    formData.append("country", country);
    formData.append("documentType", docType);
    formData.append("file", file);

    try {
      const res = await api.post("/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(res.data.message || "Uploaded successfully");
      alert("Verification request sent !")
    } catch (err) {
      setStatus(err.response?.data?.error || "Error uploading document");
      console.log(err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Upload Document for Verification
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Country</option>
            <option value="IN">India</option>
            <option value="AU">Australia</option>
            <option value="UK">UK</option>
          </select>

          {/* Document Type */}
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Document Type</option>
            <option value="aadhaar">Aadhaar</option>
            <option value="passport">Passport</option>
          </select>

          {/* File Input */}
          <input
            type="file"
            name="file" // must match multer.single("file")
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
          >
            Upload
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
        )}
      </div>
    </div>
  );
}
