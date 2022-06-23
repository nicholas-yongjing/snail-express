import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { togglePostEndorsement, togglePostvote } from "../database"

export default function ReactionBar(props) {
  const currentThread = props.currentThread;
  const content = props.content;
  //const contentType = props.contentType;
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const [endorsed, setEndorsed] = useState(content.endorsed);
  const [currentVote, setCurrentVote] = useState(getInitialVote());
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
      togglePostEndorsement(currentClass.id, currentThread.id, content.id);
    }

    function handleUpvote(e) {
      e.preventDefault();
      setCurrentVote((oldVote) => {
        return (oldVote === 'upvote') ? 'neutral' : 'upvote';
      });
      togglePostvote(currentUser.uid, 'upvote', currentClass.id,
        currentThread.id, content.id);
    }

    function handleDownvote(e) {
      e.preventDefault();
      setCurrentVote((oldVote) => {
        return (oldVote === 'downvote') ? 'neutral' : 'downvote';
      });
      togglePostvote(currentUser.uid, 'downvote', currentClass.id,
        currentThread.id, content.id);
    }

    return (
      <div className="p-2 d-flex justify-content-between align-items-center">
        {
          endorsed
            ? <div className="text-info">
              <strong>
                This post is endorsed by the tutors
              </strong>
            </div>
            : <br />
        }
        <div className="d-flex justify-content-end align-items-center gap-2">
          {
            isTutor()
              ? <button
                className="btn btn-primary"
                onClick={(e) => handleEndorse(e)}
              >
                Endorse
              </button>
              : ""
          }
          <button
            className={"btn" + (currentVote === 'upvote'
                        ? " btn-success"
                        : " btn-secondary")}
            onClick={(e) => handleUpvote(e)}
          >
            ▲
          </button>
          <button
            className={"btn" + (currentVote === 'downvote'
                        ? " btn-danger"
                        : " btn-secondary")}
            onClick={(e) => handleDownvote(e)}
          >
            ▼
          </button>=
          <div>
            {getVotes('upvotes')} Upvotes • {getVotes('downvotes')} Downvotes
          </div>
        </div>

      </div>
    );
  }