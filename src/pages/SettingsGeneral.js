import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import WebPage from "../components/WebPage";
import Button from "../components/Button";
import SettingsSideBar from "../components/SettingsSideBar";
import { useClass } from "../contexts/ClassContext";
import { addInvites, validateEmails } from "../database";

export default function SettingsGeneral() {
  const { currentClass, changeClassName } = useClass();
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const classNameRef = useRef();
  const studentFormRef = useRef();
  const studentsRef = useRef();

  useEffect(() => {
    setClassName(currentClass.className);
  }, [currentClass]);

  function handleUpdateClassName(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    changeClassName(classNameRef.current.value)
      .then(() => {
        setLoading(false);
      }).catch(() => {
        setError('Error updating class name. Please try again later');
        setLoading(false);
      });
  }

  function handleInviteStudents(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const emails = studentsRef.current.value.trim().split(/\s+/);
    if (!validateEmails(emails)) {
      setError('Invalid student emails! Please enter valid emails separated by whitespace');
      setLoading(false);
    } else {
      addInvites(currentClass.id, emails, 'student')
        .then(() => {
          studentFormRef.current.reset();
        }).catch(() => {
        setError("Failed to invite students, please try again later");
      }).finally(() => {
        setLoading(false);
      })
    }
    
  }

  return (
    <WebPage>
      <div className="flex-grow-1 d-flex">
        <SettingsSideBar />
        <div className="w-100 p-4 text-slate-200 fs-5 d-flex flex-column gap-4">
          <div className="d-flex justify-content-between">
            <h1>
              General Settings
            </h1>
            <Link to="/class-dashboard">
              <Button className="light-button">
                Back to class dashboard
              </Button>
            </Link>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form
            className="p-4 fs-4 d-flex align-items-end gap-2 slate-700"
            onSubmit={handleUpdateClassName}
          >
            <Form.Group>
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                className="generic-field"
                size='lg'
                type="text"
                ref={classNameRef}
                required
                defaultValue={className} />
            </Form.Group>
            <Button  disabled={loading} type="submit">
              Update class name
            </Button>
          </Form>
          <Form
            className="p-4 fs-4 d-flex flex-column gap-4 slate-700"
            onSubmit={handleInviteStudents}
            ref={studentFormRef}
          >
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
            <Button className="w-50 align-self-center" disabled={loading} type="submit">
              Invite students
            </Button>
          </Form>
        </div>
      </div>
    </WebPage>
  );
}