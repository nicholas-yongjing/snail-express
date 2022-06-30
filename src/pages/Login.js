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
    setError('');
    setLoading(true);
    login(emailRef.current.value, passwordRef.current.value).then(() => {
      navigate("/dashboard");
    }).catch((err) => {
        if (err.code === 'auth/invalid-email') {
          setError('Please enter valid email');
        } else if (err.code === 'auth/user-disabled') {
          setError('This account has been disabled. PLease contact the administrators for assistance');
        } else if (err.code === 'auth/user-not-found') {
          setError('This email address does not have an account. Create one by signing up!');
        } else if (err.code === 'auth/wrong-password') {
          setError('Incorrect password');
        } else {
          setError("Failed to sign in. Please try again later!");
        }
    });
    setLoading(false);
  }

  return (
    <WebPage>
        <br />
        <Container className="rounded w-75 p-4 fs-4 d-flex flex-column gap-4 justify-content-center slate-700 text-slate-200">
            <div className="d-flex justify-content-between">
              <h1 className="text-center">Login</h1>
              <Link to="/"><Button>Back</Button></Link>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control size='lg' type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control size="lg" type="password" ref={passwordRef} required />
              </Form.Group>
              <br></br>
              <Button disabled={loading} type="submit">
                Login
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link className="generic-link" to="/forgot-password">Forgot password?</Link>
            </div>
            <div className="text-center">
              New to our website? Create an account <Link className="generic-link" to="/signup">here</Link>
            </div>
        </Container>
    </WebPage>
  );
}

