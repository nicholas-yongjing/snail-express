import { useRef, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import WebPage from "../components/WebPage";

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
    <WebPage>
      <Container
        className="flex-grow-1 d-flex align-items-center justify-content-center"
      >
        <div className="w-100 rounded p-4 slate-700 text-slate-200 fs-4" style={{ maxWidth: "500px" }}>
          <h2 className="text-center mb-4">Password reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control className="fs-4" type="email" ref={emailRef} required />
            </Form.Group>
            <br></br>
            <Button disabled={loading} className="w-100 generic-button fs-4" type="submit">
              Reset password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link className="generic-link" to="/login">Return to login</Link>
          </div>
        </div>
      </Container>
    </WebPage>
  );
}
