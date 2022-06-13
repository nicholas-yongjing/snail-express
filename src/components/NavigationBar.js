import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

  function getPublicNavBar() {
    return (
      <nav className="nav-bar">
        <div className="nav-bar-left">
          <Link to="/" className="logo">snail-express</Link>
          <Link to="/">Home</Link>
          <Link to="/">Features</Link>
          <Link to="/">Pricing</Link>
        </div>
        <div className="nav-bar-right">
          <button onClick={() => {navigate('/login')}}>Log in</button>
          <button onClick={() => {navigate('/signup')}}>Sign Up</button>
        </div>
      </nav>
    );
  }

  function getPrivateNavBar() {
    return (
      <nav className="nav-bar">
        <div className="nav-bar-left">
          <Link to="/dashboard" className="logo">snail-express</Link>
          <Link to="/forums">Forums</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/lecture-feedback">Lecture Feedback</Link>
        </div>
        <div className="nav-bar-right">
          <Link to="/profile">Profile</Link>
          <button className="log-out" onClick={handleLogout}>Log out</button>
        </div>
      </nav>
    );
  }

  return (currentUser ? getPrivateNavBar() : getPublicNavBar());
}
