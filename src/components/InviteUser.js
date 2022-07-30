import { useRef } from "react";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Form } from "react-bootstrap";
import Button from "../components/Button";

export default function InviteUser(props) {
  const { currentClass, addInvites } = useClass();
  const { getStudents, getTutors, validateEmails } = firestore;
  const { setMessage, setError, loading, setLoading, role, invitationType } = props;
  const formRef = useRef();
  const usersRef = useRef();

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

  function handleInviteUsers(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const emails = usersRef.current.value.trim().split(/\s+/);
    if (!validateEmails(emails)) {
      setError('Invalid emails! Please enter valid emails separated by whitespace');
      setLoading(false);
    } else {
      getExistingUsers(emails)
        .then((existingEmails) => {
          if (existingEmails.length > 0) {
            setError('The following email(s) already belong to existing users in the class: '
              + existingEmails.join(', '));
          } else {
            addInvites(emails, invitationType)
              .then(() => {
                formRef.current.reset();
                setMessage("Users invited");
              })
          }
        }).catch(() => {
          setError("Failed to invite users, please try again later");
        }).finally(() => {
          setLoading(false);
        });
    }
  }

  function currentInvites() {
    const field = invitationType === 'student' ? "studentInvites" : "tutorInvites";
    return currentClass && currentClass[field].length == 0
      ? `No ${invitationType}s invited`
      : currentClass[field].map((email) => {
        return (
          <div key={email}>
            {email}
          </div>
        );
      })
  }

  return (
    role === 'student'
      ? "No settings available"
      : <>
        <Form
          className="p-4 fs-4 d-flex flex-column gap-4 slate-700"
          onSubmit={handleInviteUsers}
          ref={formRef}
        >
          <Form.Group>
            <Form.Label>{`Invite ${invitationType}s`}</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              ref={usersRef}
              required
              placeholder="Enter emails separated by whitespace"
              className="generic-field"
            />
          </Form.Group>
          <Button
            className="create-button align-self-center"
            disabled={loading}
            type="submit"
          >
            {`Invite ${invitationType}s`}
          </Button>
        </Form>
        <div className="slate-700 p-4">
          <h2>
            {`Pending ${invitationType} invites`}
          </h2>
          <div>
            {
              currentInvites()
            }
          </div>
        </div>
      </>
  );
}