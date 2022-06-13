import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import NavigationBar from "./NavigationBar";

export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/dashboard");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <>
      <div>
        <NavigationBar />
        <div className="sign-up">
          <h1>Sign up</h1>
          {error && <div className="sign-up-failed">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email'>Email Address: </label>
              <input type='email' id='email' ref={emailRef} required></input>
            </div>
            <div>
              <label htmlFor='password'>Password: </label>
              <input type='password' id='password' ref={passwordRef} required></input>
            </div>
            <div>
              <label htmlFor='confirm-password'>Confirm Password: </label>
              <input type='password' id='confirm-password' ref={passwordConfirmRef} required></input>
            </div>
            <button disabled={loading} type="submit">
              Sign Up
            </button>
          </form>
          <div className="sign-up-footer">
            <div className="text-center">
              Already have an account? Proceed to <Link to="/Login">login</Link>
            </div>
            <div className="text-center">
              Back to <Link to="/">home</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
