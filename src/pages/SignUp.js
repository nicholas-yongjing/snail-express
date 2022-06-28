import { useRef, useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import WebPage from "../components/WebPage";
import Button from "../components/Button";

function SignUp() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();
  const { signup, setName } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const pwdRequirement = /^(?=.*\d)(?=.*[a-zA-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/;
    if (!passwordRef.current.value.match(pwdRequirement)) {
      return setError(`Password should be 6 to 20 characters long and contain at least 1 digit, letter and special character`);
    } if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    setError("");
    setLoading(true);
    signup(emailRef.current.value, passwordRef.current.value)
      .then(() => setName(nameRef.current.value))
      .then(() => navigate("/dashboard"))
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          setError('Failed to create an account, email already in use!')
        } else {
          setError("Failed to create an account. Please try again later!");
        }
      });
    setLoading(false);
  }

  return (
    <WebPage>
        <Container className="p-4 d-flex justify-content-center gap-4">
          <div
            className="p-4 d-flex flex-column w-100 gap-4 slate-700 text-slate-200 fs-4"
          >
            <div className="d-flex justify-content-between">
              <h1 className="text-center">Sign Up</h1>
              <Link to="/"><Button>Back</Button></Link>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            <Form
              className="d-flex flex-column gap-4"
              onSubmit={handleSubmit}
              >
              <Form.Group>
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  size='lg'
                  type="name"
                  ref={nameRef}
                  required
                />
              </Form.Group>
              <Form.Group >
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  size='lg'
                  type="email"
                  ref={emailRef}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  size='lg'
                  type="password"
                  ref={passwordRef}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  size='lg'
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-50 align-self-center"
                type="submit"
              >
                Sign Up
              </Button>
            </Form>
            <div className="text-center">
              Already have an account? Proceed to {' '}
              <Link className="generic-link" to="/Login">
                login
              </Link>
            </div>
          </div>
        </Container>
    </WebPage>
  );
}

export default SignUp;
