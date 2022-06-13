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
      <div>
        <NavigationBar />
        <div className="landing-page">
          <h1>snail-express</h1>
          <h2>Post your train of thought</h2>
          <div>
            Looking for an interactive classroom application for online
            learning? Try <strong>snail-express!</strong>
          </div>
          <div>
            You are currently on our landing page.
          </div>
        </div>
      </div>
    );
  }
}
