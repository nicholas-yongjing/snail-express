import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import AddReply from "./AddReply";
import Button from "./Button";

export default function ReactionBar(props) {
  const currentThread = props.currentThread;
  const currentPost = props.currentPost;
  const content = props.content;
  const contentType = props.contentType;
  const populatePosts = props.populatePosts;
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const { togglePostvote, togglePostEndorsement } = firestore;
  const [endorsed, setEndorsed] = useState(content.endorsed);
  const [currentVote, setCurrentVote] = useState(getInitialVote());
  const [expandForm, setExpandForm] = useState(false);
  const initialVote = getInitialVote();

  function getInitialVote() {
    if (content.upvoters.includes(currentUser.uid)) {
      return 'upvote';
    } else if (content.downvoters.includes(currentUser.uid)) {
      return 'downvote';
    } else {
      return 'neutral';
    }
  }

  function getVotes(type) {
    if (type === 'upvotes') {
      let result = content.upvoters.length;
      if (currentVote === 'upvote' && initialVote !== 'upvote') {
        result += 1;
      } else if (currentVote === 'neutral' || currentVote === 'downvote') {
        if (initialVote === 'upvote') {
          result -= 1;
        }
      }
      return result;
    } else {
      let result = content.downvoters.length;
      if (currentVote === 'downvote' && initialVote !== 'downvote') {
        result += 1;
      } else if (currentVote === 'neutral' || currentVote === 'upvote') {
        if (initialVote === 'downvote') {
          result -= 1;
        }
      }
      return result;
    }
  }

  function isTutor() {
    return (
      currentClass && (
        currentClass.headTutor.id === currentUser.uid ||
        currentClass.tutorIds.includes(currentUser.uid)
      )
    );
  }

  function handleEndorse(e) {
    e.preventDefault();
    setEndorsed(!endorsed);
    togglePostEndorsement(currentClass.id, currentThread.id,
      currentPost.id, contentType === 'post' ? null : content.id);
  }

  function handleUpvote(e) {
    e.preventDefault();
    setCurrentVote((oldVote) => {
      return (oldVote === 'upvote') ? 'neutral' : 'upvote';
    });
    togglePostvote(currentUser.uid, 'upvote', currentClass.id,
      currentThread.id, currentPost.id,
      contentType === 'post' ? null : content.id);
  }

  function handleDownvote(e) {
    e.preventDefault();
    setCurrentVote((oldVote) => {
      return (oldVote === 'downvote') ? 'neutral' : 'downvote';
    });
    togglePostvote(currentUser.uid, 'downvote', currentClass.id,
      currentThread.id, currentPost.id,
      contentType === 'post' ? null : content.id);
  }

  return (
    <div className="p-4 slate-700">
      <div className="p-2 d-flex justify-content-between align-items-center">
        {
          endorsed
            ? <div className="text-info">
              <strong>
                This {contentType} is endorsed by the tutors
              </strong>
            </div>
            : <br />
        }
        <div className="d-flex justify-content-end align-items-center gap-2">
          {
            contentType === 'post'
              ? <Button className="fs-6"
                onClick={() => setExpandForm(!expandForm)}
              >
                Reply
              </Button>
              : <></>
          }
          {
            isTutor()
              ? <Button
                className="fs-6"
                onClick={(e) => handleEndorse(e)}
              >
                Endorse
              </Button>
              : <></>
          }
          <Button
            className={"fs-6" + (currentVote === 'upvote'
              ? " create-button"
              : "")}
            onClick={(e) => handleUpvote(e)}
          >
            ▲
          </Button>
          <Button
            className={"fs-6" + (currentVote === 'downvote'
              ? " delete-button"
              : "")}
            onClick={(e) => handleDownvote(e)}
          >
            ▼
          </Button>
          <div>
            {getVotes('upvotes')} Upvotes • {getVotes('downvotes')} Downvotes
          </div>
        </div>

      </div>
      {
        (contentType === 'post' && expandForm)
          ? <AddReply
            currentThread={currentThread}
            currentPost={content}
            populatePosts={() => {
              setExpandForm(false);
              populatePosts();
            }}
          />
          : <></>
      }
    </div>
  );
}