import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Form, Alert, Container } from "react-bootstrap";
import { createClass } from "../database";
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
    try {
      setMessage('');
      setError('');
      setLoading(true);
      createClass(
        classNameRef.current.value,
        {
          id: currentUser.uid,
          email: currentUser.email
        },
        studentsRef.current.value.trim().split(/\s+/),
        tutorsRef.current.value.trim().split(/\s+/))
      formRef.current.reset();
      setMessage('Class successfully created!')
    } catch {
      setError('Failed to sign in');
    }
    setLoading(false);
  }

  return (
    <WebPage>
      <div className="slate-800">
        <Container className="rounded">
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className='rounded d-grid m-5 p-4 gap-3 text-slate-200 slate-700 d-flex flex-column'
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
            <Form.Group id="class-name" className="fs-3">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                ref={classNameRef}
                required
                className="generic-field"
              />
            </Form.Group>
            <Form.Group id="students">
              <Form.Label>Students</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                ref={studentsRef}
                required
                placeholder="Enter students email separated by new lines"
                className="generic-field"
              />
            </Form.Group>
            <Form.Group id="tutors">
              <Form.Label>Tutors</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                ref={tutorsRef}
                placeholder="Enter tutors email separated by new lines"
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
      </div>
    </WebPage>
  );
}