import { Navigate } from "react-router-dom";
import { getRole } from "../services/auth";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";

export default function HomeRoute() {
  const role = getRole();

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "inspector") return <Navigate to="/inspector" replace />;

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <Dashboard />
    </ProtectedRoute>
  );
}
