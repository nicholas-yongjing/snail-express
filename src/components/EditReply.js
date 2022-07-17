import { useState, useRef } from "react";
import firestore from "../firestore";
import { useClass } from "../contexts/ClassContext";
import { Alert, Form } from "react-bootstrap";
import Button from "./Button";

export default function EditReply(props) {
  const { currentClass } = useClass();
  const { editForumReply } = firestore;
  const currentThread = props.currentThread;
  const currentPost = props.currentPost;
  const currentReply = props.currentReply;
  const populatePosts = props.populatePosts;
  const setEditing = props.setEditing;
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const postBodyRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    editForumReply(currentClass.id, currentThread.id, currentPost.id, currentReply.id,
      postBodyRef.current.value).then(() => {
        formRef.current.reset();
        setMessage('Reply successfully edited!')
        populatePosts();
      }).then(() => setEditing(false))
      .catch((err) => setError("Failed to edit post, please try again later"))
      .finally(() => setLoading(false));
  }

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-2 d-flex flex-column gap-3 slate-700"
    >
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Form.Group>
        <Form.Control
          as="textarea"
          rows={5}
          ref={postBodyRef}
          required
          placeholder="Post content"
          defaultValue={currentReply.body}
          className="generic-field"
        />
      </Form.Group>
      <Button disabled={loading} className="create-button" type="submit">
        Save Changes
      </Button>
    </Form>
  );
}