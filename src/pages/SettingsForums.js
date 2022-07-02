import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { addForumThread, getForumThreads } from "../database";
import { Alert, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import WebPage from "../components/WebPage";
import SettingsSideBar from "../components/SettingsSideBar";
import Button from "../components/Button"
import Header from "../components/Header";

export default function SettingsForums() {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [threads, setThreads] = useState([]);
  const formRef = useRef();
  const newThreadNameRef = useRef();

  useEffect(() => {
    populateThreads()
  }, [currentClass.id]);

  function isTutor() {
    return (
      currentClass && (
        currentClass.headTutor.id === currentUser.uid ||
        currentClass.tutorIds.includes(currentUser.uid)
      )
    );
  }

  function populateThreads() {
    if (isTutor() && currentClass.id) {
      getForumThreads(currentClass.id).then((retrievedThreads) => {
        if (retrievedThreads) {
          setThreads(retrievedThreads);
        }
      });
    }
  }

  async function handleCreateThread(event) {
    event.preventDefault();

    try {
      setError('');
      setLoading(true);
      await addForumThread(currentClass.id, newThreadNameRef.current.value)
      .then(() => formRef.current.reset())
      .then(() => populateThreads());
    } catch {
      setError('Failed to create forum thread');
    }
    setLoading(false);
  }

  function getTheadsSettings() {
    return (
      <>
        <Card className="p-4 slate-700 d-flex flex-column gap-2">
          <h2>Create new thread</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form
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
            <br></br>
            <Button
              disabled={loading}
              className="create-button"
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

  return (
    <WebPage>
      <div className="flex-grow-1 d-flex">
        <SettingsSideBar />
        <div className="w-100 p-4 text-slate-200 fs-5 d-flex flex-column gap-4">
          <Header
            headerText="Forums Settings"
            buttonText="Back to class dashboard"
            linkTo="/class-dashboard"
            buttonClass="light-button"
          />
          {
            isTutor()
              ? getTheadsSettings()
              : <div>No settings available</div>
          }
        </div>
      </div>
    </WebPage>
  );
}