import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import NavigationBar from "./NavigationBar";

export default function ForgotPassword() {
  const emailRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { resetPassword } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for the link to reset your password");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <div>
      <NavigationBar />
      <div className="password-reset">
        <h1>Password Reset</h1>
        {error && <div className="password-reset-failed">{error}</div>}
        {message && <div className="password-reset-message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email Address: </label>
            <input type='email' id='email' ref={emailRef} required></input>
          </div>
          <button disabled={loading} type="submit">
            Reset Password
          </button>
        </form>
        <div className="password-reset-footer">
          <Link to="/login">Return to login</Link>
        </div>
      </div>
    </div>
  );
}
