import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { togglePostEndorsement } from "../database"

export default function ReactionBar(props) {
  const currentThread = props.currentThread;
  const content = props.content;
  const contentType = props.contentType;
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const [endorsed, setEndorsed] = useState(content.endorsed);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setdownvotes] = useState(0);

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
        <button className="btn btn-success" >▲</button>
        <button className="btn btn-danger">▼</button>=
        <div>{'0'} Upvotes • {'0'} Downvotes</div>
      </div>

    </div>
  );
}