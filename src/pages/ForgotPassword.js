import { useRef, useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import WebPage from "../components/WebPage";
import Button from "../components/Button";
import Header from "../components/Header";

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
      <Container fluid='xl' className="p-5 d-flex flex-column gap-5">
        <Form onSubmit={handleSubmit} className="slate-700 p-4">
          <Header
            headerText="Reset Password"
            buttonText="Return to login"
            linkTo="/login"
          />
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form.Group id="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control size="lg" type="email" ref={emailRef} required />
          </Form.Group>
          <br></br>
          <Button disabled={loading} className="w-100" type="submit">
            Reset password
          </Button>
        </Form>
      </Container>
    </WebPage>
  );
}
