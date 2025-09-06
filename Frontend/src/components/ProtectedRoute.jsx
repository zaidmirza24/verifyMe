import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../services/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
}
