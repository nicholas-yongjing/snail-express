import { useRef, useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import WebPage from "../components/WebPage";
import Button from "../components/Button";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const emailRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    try {
      setMessage("");
      setError("");
      console.log(emailRef.current.value);
      resetPassword(emailRef.current.value);
      setMessage("Check your inbox for the link to reset your password");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <WebPage>
      <Container fluid="xl" className="p-5 d-flex flex-column gap-5">
        <Form onSubmit={handleSubmit} className="slate-700 p-4">
          <h1 className="p-1 mt-3 mb-3">Reset Password</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form.Group id="email">
            <Form.Label className="p-1">Email address</Form.Label>
            <Form.Control size="lg" type="email" ref={emailRef} required />
          </Form.Group>
          <br></br>
          <Button className="w-100" type="submit">
            Reset password
          </Button>
        </Form>
      </Container>
    </WebPage>
  );
}
