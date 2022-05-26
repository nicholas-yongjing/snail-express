import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from "./NavigationBar";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate("/login", {replace: true});
    } catch {
      setError('Failed to log out')
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="fs-1">
        DASHBOARD BIG BIG
      </div>
    </>
  );
}
