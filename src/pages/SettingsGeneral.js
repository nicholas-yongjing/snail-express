import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { addInvites, getStudents, getTutors, validateEmails } from "../database";
import { Form, Alert } from "react-bootstrap";
import WebPage from "../components/WebPage";
import SettingsSideBar from "../components/SettingsSideBar";
import Header from "../components/Header";
import Button from "../components/Button";


export default function SettingsGeneral() {
  const { currentUser } = useAuth();
  const { currentClass, changeClassName } = useClass();
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const classNameRef = useRef();
  const studentFormRef = useRef();
  const studentsRef = useRef();

  const isTutor = useCallback(() => {
    return (
      currentClass && (
        currentClass.headTutor.id === currentUser.uid ||
        currentClass.tutorIds.includes(currentUser.uid)
      )
    );
  }, [currentClass, currentUser.uid])

  async function getStudentEmails() {
    return getStudents(currentClass.id)
      .then((students) => students.map(student => student.email));
  }

  async function getTutorEmails() {
    return getTutors(currentClass.id)
      .then((tutors) => tutors.map(tutor => tutor.email));
  }

  async function getExistingUsers(emails) {
    return Promise.all([getStudentEmails(), getTutorEmails()])
      .then(([studentEmails, tutorEmails]) => {
        return emails.filter((email) => {
          return (
            email === currentClass.headTutor.email
            || (studentEmails.includes(email))
            || (tutorEmails.includes(email))
          );
        });
      })
  }

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
      getExistingUsers(emails).then((existingEmails) => {
        if (existingEmails.length > 0) {
          setError('The following email(s) already belong to existing users in the class: '
            + existingEmails.join(', '));
        } else {
          addInvites(currentClass.id, emails, 'student')
            .then(() => {
              studentFormRef.current.reset();
            })
        }
      }).catch((err) => {
        console.log(err);
        setError("Failed to invite students, please try again later");
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  return (
    <WebPage>
      <div className="flex-grow-1 d-flex">
        <SettingsSideBar />
        <div className="w-100 p-4 text-slate-200 fs-5 d-flex flex-column gap-4">
          <Header
            headerText="General Settings"
            buttonText="Back to class dashboard"
            linkTo="/class-dashboard"
            buttonClass="light-button"
          />
          {
            isTutor()
              ? <>
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
                  <Button disabled={loading} type="submit">
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
              </>
              : "No settings available"
          }
        </div>
      </div>
    </WebPage>
  );
}