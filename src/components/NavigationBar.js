import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      console.log("Failed to log out");
    }
  }

  function getPublicNavbar() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
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
              <Link className="nav-link" to='/'>Home</Link>
              <Link className="nav-link" to='/'>Features</Link>
              <Link className="nav-link" to='/'>Pricing</Link>
            </div>
          </div>
          <nav className="navbar navbar-dark bg-dark">
            <form className="form-inline">
              <a
                href="/login"
                className="btn bg-primary text-white"
                role="button"
              >
                Login
              </a>
              <span> </span>
              <a
                href="/signup"
                className="btn btn-secondary text-white"
                role="button"
              >
                Sign Up
              </a>
            </form>
          </nav>
        </div>
      </nav>
    );
  }

  function getPrivateNavBar() {
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
              <Link className="nav-link text-light" to='/forums'>Forums</Link>
              <Link className="nav-link text-light" to='/'>Quiz</Link>
              <Link className="nav-link text-light" to='/'>Lecture Feedback</Link>
            </div>
          </div>
          <div>
            <Link className="nav-link text-light" to='/profile'>Profile</Link>
          </div>
          <nav className="navbar navbar-dark bg-dark">
            <form className="form-inline">
            <Link
              className="btn bg-secondary text-white"
              role="button"
              to="/"
              onClick={handleLogout}
            >
              Log out
            </Link>
            </form>
          </nav>
        </div>
      </nav>
    );
  }

  return (currentUser ? getPrivateNavBar() : getPublicNavbar());
}
