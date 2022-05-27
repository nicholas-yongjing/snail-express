import React, {useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/dashboard">
          snail-express
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-link" aria-current="page" href="#">
              Forum
            </a>
            <a className="nav-link" href="#">
              Lecture
            </a>
            <a className="nav-link" href="#">
              Quiz
            </a>
          </div>
        </div>
        <div>
            <a className="nav-link text-light" href="/profile">
                View profile
            </a>
        </div>
        <nav className="navbar navbar-dark bg-dark">
            <form className="form-inline">
              <a
                href="/"
                className="btn bg-secondary text-white"
                role="button"
                onClick={handleLogout}
              >
                Log out
              </a>
              </form>
              </nav>
      </div>
    </nav>
  );
}
