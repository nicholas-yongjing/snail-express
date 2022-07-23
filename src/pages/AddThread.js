import { useRef, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Alert, Card, Form } from "react-bootstrap";
import Header from "../components/Header";
import Button from "../components/Button"

export default function AddThread(props) {
  const { currentClass } = useClass();
  const { addForumThread } = firestore;
  const populateThreads = props.populateThreads;
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const formRef = useRef();
  const newThreadNameRef = useRef();

  async function handleCreateThread(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    addForumThread(currentClass.id, newThreadNameRef.current.value)
      .then(() => {
        formRef.current.reset();
        populateThreads();
        setMessage('Thread added')
      }).catch(() => setError('Failed to create forum thread. Please try again later.'))
      .finally(() => setLoading(false));
  }

  return (
    <Card className={"p-4 slate-700 d-flex flex-column gap-2 " + props.className}>
      <Header
        headerText={currentClass ? currentClass.className : ''}
        buttonText="Back to dashboard"
        linkTo="/class-dashboard"
        buttonClass="light-button"
      />
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Form
        className="d-flex flex-column gap-4"
        ref={formRef}
        onSubmit={handleCreateThread}
      >
        <Form.Group id="thread-name">
          <Form.Label>Thread Name</Form.Label>
          <Form.Control
            type="text"
            ref={newThreadNameRef}
            required
            className="generic-field fs-4"
          />
        </Form.Group>
        <Button
          disabled={loading}
          className="align-self-start create-button"
          type="submit"
        >
          Create Thread
        </Button>
      </Form>
    </Card>
  );
}