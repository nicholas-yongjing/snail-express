import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import SnailLogo from "../images/snail-logo.png";

export default function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const { currentClass, setCurrentClass } = useClass();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      setCurrentClass(null);
      await logout();
      navigate("/login", { replace: true });
    } catch {
      alert("Failed to log out");
    }
  }

  function getLinks() {
    if (currentUser && currentClass) {
      return (
        <div className="navbar-nav fs-5" style={{margin: "12px"}}>
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
            to="/quiz-dashboard"
          >
            Quiz
          </Link>
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/live-feedback"
          >
            Lecture Feedback
          </Link>
        </div>
      );
    } else if (!currentUser) {
      return (
        <div className="navbar-nav fs-5" style={{margin: "12px"}}>
          <Link
            className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700"
            to="/"
          >
            Home
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
          className="nav-link rounded"
          to="/profile"
        >
          <button className="btn slate-900 text-slate-200 hover-slate-200 hover-text-slate-700 fs-5">Profile</button>
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
        <Link
          to="/login"
          className="btn border-slate-200 text-slate-200 hover-slate-200 hover-text-slate-700 fs-5"
          role="button"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="btn border-slate-200 text-slate-200 hover-slate-200 hover-text-slate-700 fs-5"
          role="button"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg p-3 justify-content-between slate-900">
      <div className="d-flex align-items-center">
        <Link
          className="d-flex gap-4 align-items-center nav-link text-slate-200 text-slate-200 hover-text-slate-200 fs-3"
          to="/dashboard"
        >
          <img src={SnailLogo} alt="snail express" style={{ width: "40px" }} />
          snail-express
        </Link>
        {getLinks()}
      </div>
      {getButtons()}
    </nav>
  );
}
