import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { Link, useNavigate } from "react-router-dom";

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
      return (<div className="navbar-nav fs-5">
        <Link className="nav-link text-light" to='/class-dashboard'>Dashboard</Link>
        <Link className="nav-link text-light" to='/forums'>Forums</Link>
        <Link className="nav-link text-light" to='/'>Quiz</Link>
        <Link className="nav-link text-light" to='/'>Lecture Feedback</Link>
      </div>
      );
    } else if (!currentUser) {
      return (
        <div className="navbar-nav fs-5">
          <Link className="nav-link" to='/'>Home</Link>
          <Link className="nav-link" to='/'>Features</Link>
          <Link className="nav-link" to='/'>Pricing</Link>
        </div>
      );
    } else {
      return <></>;
    }
  }

  function getButtons() {
    return (
      currentUser
        ? <div className="d-flex">
          <Link className="nav-link text-light" to='/profile'>Profile</Link>
          <button
            className="btn bg-secondary text-white fs-5"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
        : <div className="d-flex gap-3">
          <a
            href="/login"
            className="btn bg-primary text-white fs-5"
            role="button"
          >
            Login
          </a>
          <a
            href="/signup"
            className="btn btn-secondary text-white fs-5"
            role="button"
          >
            Sign Up
          </a>
        </div>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 justify-content-between">
      <div className="d-flex align-items-center">
        <Link className="nav-link text-light fs-3" to='/dashboard'>snail-express</Link>
        {getLinks()}
      </div>

      {getButtons()}

    </nav >
  );
}
