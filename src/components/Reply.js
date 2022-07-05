import { useCallback, useEffect, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import { getUser } from "../database";
import ReactionBar from "../components/ReactionBar";

export default function Reply(props) {
  const {currentClass} = useClass();
  const currentThread = props.thread;
  const currentPost = props.post;
  const currentReply = props.reply;
  const [author, setAuthor] = useState([]);

  const getUserGroup = useCallback((user) => {
    if (user && currentClass) {
      if (currentClass.studentIds.includes(user.id)) {
        return "students";
      } else if (currentClass.tutorIds.includes(user.id)) {
        return "tutors";
      } else if (currentClass.headTutor.id === user.id) {
        return 'headTutor';
      } else {
        return null;
      }
    }
  }, [currentClass])

  const populateAuthor = useCallback(() => {
    if (currentClass && currentThread && currentReply) {
      const userGroup = getUserGroup(currentReply.author);
      if (!userGroup) {
        setAuthor({name: "[Deleted User]", role: 'Unknown role'});
      } else if (userGroup === 'headTutor') {
        setAuthor({...currentClass.headTutor, role: 'Head Tutor'});
      } else {
        getUser(currentClass.id, userGroup, currentReply.author.id)
          .then((user) => {
            setAuthor({...user, role: (userGroup === 'students' ? 'Student' : 'Tutor')});
          });
      }
    }
  }, [currentClass, currentThread, currentReply, getUserGroup]);

  useEffect(() => {
    populateAuthor();
  }, [populateAuthor]);

  return (
    <div className='d-flex gap-5'>
      <div className='vr'></div>
      <div className="flex-grow-1 rounded slate-700 text-slate-200">
        <div className='p-4'>
          <h4 className='d-flex gap-4'>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
            <span>{author.level !== undefined ? `Level ${author.level}` : ''}</span>
          </h4>      
          <p>{currentReply.body}</p>
        </div>
        <ReactionBar
          currentThread={currentThread}
          currentPost={currentPost}
          content={currentReply}
          contentType='reply'
          populatePosts={null}
        />
      </div>

    </div>
  );
}