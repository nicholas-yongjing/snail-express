import { useState, useRef } from "react";
import firestore from "../firestore";
import { useAuth } from "../contexts/AuthContext"
import { useClass } from "../contexts/ClassContext";
import { Alert, Card, Form } from "react-bootstrap";
import Button from "./Button";

export default function AddPost(props) {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const { addForumPost } = firestore;
  const currentThread = props.currentThread;
  const populatePosts = props.populatePosts;
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const formRef = useRef();
  const postTitleRef = useRef();
  const postBodyRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    addForumPost(currentClass.id,
      currentThread.id,
      postTitleRef.current.value,
      postBodyRef.current.value,
      {
        id: currentUser.uid,
        email: currentUser.email
      }
    ).then(() => {
      formRef.current.reset();
      setMessage('Post successfully created!')
      populatePosts();
    }).catch(() => setError("Failed to create post, please try again later"))
    .finally(() => setLoading(false));
  }

  return (
    <Card className="p-3 slate-700 text-slate-200">
      <h2>Create Post</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-2 d-flex flex-column gap-3"
      >
        <Form.Group>
          <Form.Control
            type="text"
            ref={postTitleRef}
            required
            placeholder="Title"
            className="generic-field"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={5}
            ref={postBodyRef}
            required
            placeholder="Post content"
            className="generic-field"
          />
        </Form.Group>
        <Button disabled={loading} className="create-button" type="submit">
          Create Post
        </Button>
      </Form>
    </Card>
  );
}