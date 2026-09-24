import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Task Manager
      </Link>
      {token && (
        <div className="navbar-actions">
          {user && <span className="navbar-user">{user.email}</span>}
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
