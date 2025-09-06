import { logout, getRole, getToken } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = getRole();
  const token = getToken();

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-lg font-bold tracking-wide">
          VerifyMe
        </Link>

        {/* Center links for logged in users */}
        {token && (
          <div className="space-x-6">
           { role ==="user" && <Link to="/" className="text-white hover:text-gray-200 focus:underline">Dashboard</Link>}
            {role === "user" && (
              <Link to="/verify" className="text-white hover:text-gray-200 focus:underline">Verify</Link>
            )}
            {role === "inspector" && (
              <Link to="/inspector" className="text-white hover:text-gray-200 focus:underline">Dashboard</Link>
            )}
            {role === "admin" && (

              <>
              <Link to="/admin" className="text-white hover:text-gray-200 focus:underline">Admin Dashboard</Link>
              <Link to="/inspector" className="text-white hover:text-gray-200 focus:underline">Inspect</Link>
              <Link to="/logs" className="text-white hover:text-gray-200 focus:underline">Audit Logs</Link>
              </>
            )}
          </div>
        )}

        {/* Right-side actions */}
        <div className="flex items-center space-x-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 font-medium"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-white text-indigo-600 px-4 py-1 rounded-full font-medium shadow hover:bg-gray-100 transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-4 py-1 rounded-full font-medium shadow hover:bg-gray-100 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
