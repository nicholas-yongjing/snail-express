import { useAuth } from "../contexts/AuthContext"
import { useClass } from "../contexts/ClassContext";
import { addForumReply } from "../database";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useState, useRef } from "react";

export default function AddReply(props) {
    const { currentUser } = useAuth();
    const { currentClass } = useClass();
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
        try {
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
                });
            formRef.current.reset();
            setMessage('Reply successfully posted!')
            populatePosts();
        } catch {
            setError('Failed to send reply');
        }
        setLoading(false);
    }

    return (
        <Card className="p-3">
            <h2>Post Reply</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-2 d-flex flex-column gap-3"
            >
                <Form.Group id="post-body">
                    <Form.Control
                        as="textarea"
                        rows={5}
                        ref={postBodyRef}
                        required
                        placeholder="Reply"
                    />
                </Form.Group>
                <br></br>
                <Button disabled={loading} className="w-25" type="submit">
                    Create Reply
                </Button>
                <br></br>
            </Form>
        </Card>
    );
}