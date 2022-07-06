import { useState, useRef } from "react";
import firestore from "../firestore";
import { useAuth } from "../contexts/AuthContext"
import { useClass } from "../contexts/ClassContext";
import { Alert, Card, Form } from "react-bootstrap";
import Button from "./Button";

export default function AddReply(props) {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const { addForumReply } = firestore;
  const currentThread = props.currentThread;
  const currentPost = props.currentPost;
  const populatePosts = props.populatePosts;
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const formRef = useRef();
  const postBodyRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    addForumReply(currentClass.id,
      currentThread.id,
      currentPost.id,
      postBodyRef.current.value,
      {
        id: currentUser.uid,
        email: currentUser.email
      }
    ).then(() => {
      formRef.current.reset();
      setMessage('Reply successfully posted!')
      populatePosts();
    }).catch(() => setError("Failed to create reply, please try again later"))
    .finally(() => setLoading(false));
  }

  return (
    <Card className="p-4 slate-800 text-slate-200">
      <h2>Post Reply</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        className="d-flex flex-column gap-3"
      >
        <Form.Group id="post-body">
          <Form.Control
            as="textarea"
            rows={5}
            ref={postBodyRef}
            required
            placeholder="Reply"
            className="generic-field-light"
          />
        </Form.Group>
        <Button disabled={loading} className="align-self-start create-button" type="submit">
          Create Reply
        </Button>
      </Form>
    </Card>
  );
}