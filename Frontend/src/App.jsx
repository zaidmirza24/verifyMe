import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VerifyUpload from "./pages/VerifyUpload";
import InspectorDashboard from "./pages/InspectorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { getRole } from "./services/auth";
import AuditLogPage from "./components/Logs.jsx";
import HomeRoute from "./components/HomeRoute.jsx";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
                <HomeRoute/>
            }
            
          />

          <Route
            path="/verify"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <VerifyUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inspector"
            element={
              <ProtectedRoute allowedRoles={["inspector", "admin"]}>
                <InspectorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AuditLogPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
