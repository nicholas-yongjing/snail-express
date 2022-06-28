import { useRef, useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import WebPage from "../components/WebPage";
import Button from "../components/Button";

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
    <WebPage>
        <Container className="p-5 d-flex align-items-center justify-content-center">
          <div className="d-flex flex-column rounded p-4 slate-700 text-slate-200 gap-2 fs-4">
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control size='lg' type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control size="lg" type="password" ref={passwordRef} required />
              </Form.Group>
              <br></br>
              <Button disabled={loading} className="" type="submit">
                Login
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link className="generic-link" to="/forgot-password">Forgot password?</Link>
            </div>
            <div className="text-center">
              New to our website? Create an account <Link className="generic-link" to="/signup">here</Link>
            </div>
            <div className="text-center">
              Back to <Link className="generic-link" to="/">home</Link>
            </div>
          </div>
        </Container>
    </WebPage>
  );
}

