import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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


        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <br></br>
              <Button disabled={loading} className="w-100" type="submit">
                Enter
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Card.Body>
        </Card>
        <br></br>
        <div className="text-center">
          New to our website? Create an account <Link to="/signup">here</Link>
        </div>
        <div className="text-center">
          Back to <Link to="/">home</Link>
        </div>
      </div>
    </>
  );
}

