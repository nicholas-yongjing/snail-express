import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Form, Alert, Container } from "react-bootstrap";
import { validateEmails, createClass } from "../database";
import WebPage from "../components/WebPage";
import Button from "../components/Button";

export default function AddClass() {
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const formRef = useRef();
  const classNameRef = useRef();
  const studentsRef = useRef();
  const tutorsRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const studentEmails = studentsRef.current.value.trim().split(/\s+/);
    const tutorEmails = tutorsRef.current.value
      ? tutorsRef.current.value.trim().split(/\s+/)
      : [];
    if (!validateEmails(studentEmails)) {
      setError('Invalid student emails! Please enter valid emails separated by whitespace');
    } else if (!validateEmails(tutorEmails)) {
      setError('Invalid tutor emails! Please enter valid emails separated by whitespace');
    } else {
      createClass(
        classNameRef.current.value,
        {
          id: currentUser.uid,
          email: currentUser.email
        },
        studentEmails,
        tutorEmails
      ).then(() => {
        formRef.current.reset();
        setMessage('Class successfully created!');
      }).catch((err) => {
        console.log(err)
        setError('Failed to create class, try again later!');
      })
    }
    setLoading(false);
  }

  return (
    <WebPage>
        <Container>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className='rounded fs-4 d-grid m-5 p-4 gap-3 text-slate-200 slate-700 d-flex flex-column'
          >
            <div className="d-flex justify-content-between">
              <h1>Create Class</h1>
              <Link to="/class-dashboard">
                <Button>
                  Back to dashboard
                </Button>
              </Link>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form.Group>
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                ref={classNameRef}
                required
                className="generic-field"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Students</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                ref={studentsRef}
                required
                placeholder="Enter students email separated by whitespace"
                className="generic-field"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tutors</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                ref={tutorsRef}
                placeholder="Enter tutors email separated by whitespace"
                className="generic-field"
              />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-25 align-self-center create-button"
              type="submit"
            >
              Create Class
            </Button>
          </Form>
        </Container>
    </WebPage>
  );
}