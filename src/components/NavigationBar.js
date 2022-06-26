import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { Link, useNavigate } from "react-router-dom";
import SnailLogo from "../images/snail-logo.png"

export default function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const { currentClass } = useClass();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      console.log("Failed to log out");
    }
  }

  function getLinks() {
    if (currentUser && currentClass) {
      return (
        <div className="navbar-nav  fs-5">
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/class-dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/forums"
          >
            Forums
          </Link>
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/"
          >
            Quiz
          </Link>
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/livefeedback"
          >
            Lecture Feedback
          </Link>
        </div>
      );
    } else if (!currentUser) {
      return (
        <div className="navbar-nav fs-5">
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/"
          >
            Home
          </Link>
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/"
          >
            Features
          </Link>
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/"
          >
            Pricing
          </Link>
        </div>
      );
    } else {
      return <></>;
    }
  }

  function getButtons() {
    return currentUser ? (
      <div className="d-flex gap-2">
        <Link
          className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700 fs-5"
          to="/profile"
        >
          Profile
        </Link>
        <button
          className="btn bg-secondary text-white fs-5"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    ) : (
      <div className="d-flex gap-3">
        <a
          href="/login"
          className="btn border-slate-200 text-slate-200 hover-slate-200 hover-text-slate-700 fs-5"
          role="button"
        >
          Login
        </a>
        <a
          href="/signup"
          className="btn border-slate-200 text-slate-200 hover-slate-200 hover-text-slate-700 fs-5"
          role="button"
        >
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg p-3 justify-content-between slate-900">
      <div className="d-flex align-items-center">
        <img
         src={SnailLogo}
         alt="snail express"
         style={{width: '40px'}}
        />
        <Link
          className="nav-link text-slate-200 text-slate-200 hover-text-slate-300 fs-3"
          to="/dashboard"
        >
          snail-express
        </Link>
        {getLinks()}
      </div>
      {getButtons()}
    </nav>
  );
}
