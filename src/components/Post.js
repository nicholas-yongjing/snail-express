import { Card } from 'react-bootstrap';
import ReactionBar from "../components/ReactionBar";

export default function Post(props) {
  const thread = props.thread;
  const post = props.post;

  return (
    <Card>
      <Card.Body>
        <h3><strong>{post.title}</strong></h3>
        <h4>{post.author.email}</h4>
        <p>{post.body}</p>
      </Card.Body>
      <ReactionBar
        currentThread={thread}
        content={post}
        contentType='post'
      />
    </Card>
  );
}