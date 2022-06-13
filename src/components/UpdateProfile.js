import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import NavigationBar from "./NavigationBar";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();
  const { currentUser, updateUserPassword, updateUserEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateUserEmail(emailRef.current.value));
    }

    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    Promise
      .all(promises)
      .then(() => {
        navigate("/dashboard");
      })
      .catch(() => {
        setError("Failed to update profile");
      })
      .finally(() => {
        setLoading(false);
        setError();
      });
  }

  return (
    <div>
      <NavigationBar />
      <div className="content profile-update">
        <h1>Profile Update</h1>
        {error && <div className="profile-update-failed">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email Address: </label>
            <input
              type='email'
              id='email'
              ref={emailRef}
              defaultValue={currentUser.email}
              required>
            </input>
          </div>
          <div>
            <label htmlFor='password'>Password: </label>
            <input
              type='password'
              id='password'
              ref={passwordRef}
              placeholder="Leave blank to keep the same"
              required>
            </input>
          </div>
          <div>
            <label htmlFor='confirm-password'>Confirm Password: </label>
            <input
              type='password'
              id='confirm-password'
              ref={passwordConfirmRef}
              placeholder="Leave blank to keep the same"
              required>
            </input>
          </div>
          <button className="generic-button" disabled={loading} type="submit">
            Update profile
          </button>
        </form>
        <div className="text-center">
          <Link to="/dashboard">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
