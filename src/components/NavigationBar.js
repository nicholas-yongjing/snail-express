import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import SnailLogo from "../images/snail-logo.png";
import Button from "./Button";
import HomeImg from '../images/home.svg';
import ProfileImg from '../images/profile.svg';
import LogoutImg from '../images/logout.svg';

export default function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const { setCurrentClass } = useClass();
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
    return (
      <div className="navbar-nav fs-5 m-2">
        <Link
          className="nav-link rounded text-slate-200 hover-slate-200 hover-text-slate-700 d-flex align-items-center gap-2"
          to="/"
        >
        <img
          src={HomeImg}
          alt="home"
          className="filter-slate-500"
          style={{ width: '20px' }}
        />
          Home
        </Link>
      </div>
    );
  }

  function getButtons() {
    return currentUser ? (
      <div className="d-flex gap-2">
        <Link className="nav-link rounded" to="/profile">
          <Button className="d-flex align-items-center gap-2 btn slate-900 text-slate-200 hover-slate-200 hover-text-slate-700 fs-5">
            <img
              src={ProfileImg}
              alt="profile"
              className="filter-slate-500"
              style={{ width: '20px' }}
            />
            <div>
              Profile
            </div>
          </Button>
        </Link>
        <Button
          className="fs-5 d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <img
            src={LogoutImg}
            alt="log out"
            className="filter-slate-500"
            style={{ width: '20px' }}
          />
          Log out
        </Button>
      </div>
    ) : (
      <div className="d-flex gap-3">
        <Link
          data-testid="login"
          to="/login"
          className="btn border-slate-200 text-slate-200 hover-slate-200 hover-text-slate-700 fs-5"
          role="button"
        >
          Login
        </Link>
        <Link
          data-testid="signup"
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
    <nav
      data-testid="navbar"
      className="navbar navbar-expand-lg p-3 justify-content-between slate-900"
    >
      <div className="d-flex align-items-center">
        <Link
          data-testid="link"
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
