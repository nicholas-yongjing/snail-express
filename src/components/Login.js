import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import NavigationBar from "./NavigationBar";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/dashboard");
    } catch {
      setError('Failed to sign in');
    }
    setLoading(false);
  }

  return (
    <div>
      <NavigationBar />
      <div className="content log-in">
        <h1>Log in</h1>
        {error && <div className="log-in-failed">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email Address: </label>
            <input type='email' id='email' ref={emailRef} required></input>
          </div>
          <div>
            <label htmlFor='password'>Password: </label>
            <input type='password' id='password' ref={passwordRef} required></input>
          </div>
          <button className="generic-button" disabled={loading} type="submit">
            Log in
          </button>
        </form>
        <div className="log-in-footer">
          <Link to="/forgot-password">Forgot password?</Link>
          <div>
            New to our website? Create an account <Link to="/signup">here</Link>
          </div>
          <div>
            Back to <Link to="/">home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

