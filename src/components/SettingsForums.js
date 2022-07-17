import { useCallback, useEffect, useRef, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Card, Form } from "react-bootstrap";
import Button from "../components/Button"

export default function SettingsForums(props) {
  const { currentClass } = useClass();
  const { addForumThread, getForumThreads } = firestore;
  const { setMessage, setError, loading, setLoading, role } = props;
  const [threads, setThreads] = useState([]);
  const formRef = useRef();
  const newThreadNameRef = useRef();

  const populateThreads = useCallback(() => {
    if (currentClass && (role === 'head tutor' || role === 'tutor')) {
      getForumThreads(currentClass.id).then((retrievedThreads) => {
        if (retrievedThreads) {
          setThreads(retrievedThreads);
        }
      });
    }
  }, [currentClass, role, getForumThreads]);

  useEffect(() => {
    populateThreads()
  }, [populateThreads]);

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
      }).catch(() => setError('Failed to create forum thread'))
      .finally(() => setLoading(false));
  }

  return (
    role === 'student'
      ? "No settings available"
      : <>
        <Card className="p-4 slate-700 d-flex flex-column gap-2">
          <h2>Create new thread</h2>
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
        <Card className="p-4 slate-700 d-flex flex-column gap-2">
          <h2>
            Forum Threads
          </h2>
          <div className="d-flex flex-column gap-2 fs-4">
            {
              (threads.length > 0)
                ? threads.map((thread) => {
                  return (
                    <Card
                      key={thread.id}
                      className="p-2 slate-800"
                    >
                      {thread.name}
                    </Card>
                  );
                })
                : "No threads created"
            }
          </div>
        </Card>
      </>
  );
}