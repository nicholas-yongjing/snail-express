import React, { useState } from "react";

export default function LandingPage() {

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
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
      <div className="fs-1">
        HOME PAGE BIG BIG
      </div>
    </>
  );
}
