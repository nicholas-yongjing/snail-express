import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useClass } from '../contexts/ClassContext';
import { getForumReplies } from '../database';
import ReactionBar from "../components/ReactionBar";
import Reply from "../components/Reply"

export default function Post(props) {
  const { currentClass } = useClass();
  const currentThread = props.thread;
  const currentPost = props.post;
  const populatePosts = props.populatePosts;
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    populateReplies();
  }, [populatePosts]);

  function populateReplies() {
    if (currentClass && currentThread && currentPost) {
      getForumReplies(currentClass.id, currentThread.id, currentPost.id)
        .then((retrievedReplies) => {
          setReplies(retrievedReplies);
        });
    }
  }

  return (
    <div>
    <Card>
      <Card.Body>
        <h3><strong>{currentPost.title}</strong></h3>
        <h4>{currentPost.author.email}</h4>
        <p>{currentPost.body}</p>
      </Card.Body>
      <ReactionBar
        currentThread={currentThread}
        content={currentPost}
        contentType='post'
        populatePosts={populatePosts}
      />
    </Card>
    <div style={{marginLeft: '40px'}}>
    {
      replies.map((reply) => {
        return(
          <Reply
            key={reply.id}
            thread={currentThread}
            post={currentPost}
            reply={reply}
          />
        );
      })
    }
 
    </div>
   </div>
 );
}