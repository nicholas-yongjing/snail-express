import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    navigate("/dashboard");
  } else {
    return (
      <>
      <div className="container">
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
                <a className="nav-link" href="/">
                  Home
                </a>
                <a className="nav-link" href="#">
                  Features
                </a>
                <a className="nav-link" href="#">
                  Pricing
                </a>
                <a className="nav-link disabled"></a>
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
