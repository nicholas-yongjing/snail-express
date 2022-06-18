import React from "react";
import {Link} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Container } from "react-bootstrap";

import NavigationBar from "./NavigationBar";
import Invites from "./Invites"; 

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      <NavigationBar />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <div className="fs-2">
            Welcome back! <strong>{currentUser.email}</strong>
          </div>
          <br></br>
          <div className="fs-2">You are currently on the dashboard page.</div>
          <Invites />
          <Link to="/add-class">Add Class</Link>
        </div>
      </Container>
    </>
  );
}
