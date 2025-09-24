import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import IncidentForm from "./components/IncidentForm";
import IncidentDetails from "./components/IncidentDetails";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { getToken, clearToken } from "./auth";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(!!getToken());

  useEffect(() => {
    // sync auth flag with storage on route changes
    setAuthed(!!getToken());
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  // Simple auth guard wrapper
  const RequireAuth = ({ children }) => {
    if (!getToken()) {
      return (
        <div className="main-content">
          <div className="card">
            <h3 className="card-title">Authentication required</h3>
            <p className="mt-sm">Please <Link className="nav-link" to="/login">login</Link> to continue.</p>
          </div>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🚨</span>
            <span>Incident Management</span>
          </Link>
          
          <nav>
            <ul className="nav-menu">
              {authed && (
                <>
                  <li>
                    <Link to="/" className={isActive("/")}>
                      🏠 Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/create" className={isActive("/create")}>
                      ➕ Create Incident
                    </Link>
                  </li>
                  <li>
                    <Link to="/search" className={isActive("/search")}>
                      🔍 Search
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin" className={isActive("/admin")}>
                      🛠️ Admin
                    </Link>
                  </li>
                </>
              )}
              <li style={{ marginLeft: "1rem" }}>
                {authed ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      clearToken();
                      setAuthed(false);
                      navigate("/login");
                    }}
                  >
                    🚪 Logout
                  </button>
                ) : (
                  <Link to="/login" className={isActive("/login")}>
                    🔑 Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth><IncidentForm /></RequireAuth>} />
          <Route path="/incidents/:id" element={<RequireAuth><IncidentDetails /></RequireAuth>} />
          <Route path="/edit/:id" element={<RequireAuth><IncidentForm /></RequireAuth>} />
          <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}
