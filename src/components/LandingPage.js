import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import NavigationBar from "./NavigationBar";

export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    navigate("/dashboard");
  } else {
    return (
      <>
      <div className="container">
        <NavigationBar />
        <div className="d-flex flex-column">
          <h1 className="d-flex justify-content-center text-primary">snail-express</h1>
          <div className="d-flex justify-content-center text-secondary">Post your train of thought</div>
          <br></br>
          <div className="fs-2">
            Looking for an interactive classroom application for online
            learning? Try <strong>snail-express!</strong>
          </div>
          <br></br>
          <div className="fs-2">You are currently on our landing page.</div>
        </div>
      </div>
      </>
    );
  }
}
