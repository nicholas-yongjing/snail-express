import { Card } from 'react-bootstrap';
import ReactionBar from "../components/ReactionBar";

export default function Reply(props) {
  const currentThread = props.thread;
  const currentPost = props.post;
  const currentReply = props.reply;

  return (
    <Card>
      <Card.Body>
        <h4>{currentReply.author.email}</h4>
        <p>{currentReply.body}</p>
      </Card.Body>
      <ReactionBar
        currentThread={currentThread}
        currentPost={currentPost}
        content={currentReply}
        contentType='reply'
        populatePosts={null}
      />
    </Card>
 );
}