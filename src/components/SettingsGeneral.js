import { useRef } from "react";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Form } from "react-bootstrap";
import Button from "../components/Button";

export default function SettingsGeneral(props) {
  const { currentClass, changeClassName } = useClass();
  const { addInvites, getStudents, getTutors, validateEmails } = firestore;
  const { setMessage, setError, loading, setLoading, role } = props;
  const classNameRef = useRef();
  const studentFormRef = useRef();
  const studentsRef = useRef()

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

  function handleUpdateClassName(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    changeClassName(classNameRef.current.value)
      .then(() => setMessage("Class name updated"))
      .catch(() => {
        setError('Error updating class name. Please try again later');
      }).finally(() => setLoading(false));
  }

  function handleInviteStudents(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const emails = studentsRef.current.value.trim().split(/\s+/);
    if (!validateEmails(emails)) {
      setError('Invalid student emails! Please enter valid emails separated by whitespace');
      setLoading(false);
    } else {
      getExistingUsers(emails)
        .then((existingEmails) => {
          if (existingEmails.length > 0) {
            setError('The following email(s) already belong to existing users in the class: '
              + existingEmails.join(', '));
          } else {
            addInvites(currentClass.id, emails, 'student')
              .then(() => {
                studentFormRef.current.reset();
                setMessage("Students invited")
              })
          }
        }).catch(() => {
          setError("Failed to invite students, please try again later");
        }).finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    role === 'student'
      ? "No settings available"  
      : <>
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
              defaultValue={currentClass.className} />
          </Form.Group>
          <Button
            disabled={loading}
            type="submit"
            className="create-button"
          >
            Update
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
          <Button
            className="create-button align-self-center"
            disabled={loading}
            type="submit"
          >
            Invite students
          </Button>
        </Form>
      </>
  );
}