import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  /*async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Failed to log out");
    }
  }*/

  return (
    <>
      <NavigationBar></NavigationBar>
      <div className="fs-2">
        Welcome back! <strong>{currentUser.email}</strong>
      </div>
      <br></br>
      <div className="fs-2">You are currently on the dashboard page.</div>
    </>
  );
}
