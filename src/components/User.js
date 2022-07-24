import { useCallback, useEffect, useState } from 'react';
import { useClass } from '../contexts/ClassContext';
import firestore from '../firestore';
import Achievements from './Achievements';

export default function User(props) {
  const { currentClass } = useClass();
  const { getLevellingSettings, getUser } = firestore;
  const [user, setUser] = useState({});
  const userId = props.userId;
  const [levelUpExp, setlevelUpExp] = useState([]);

  const getUserGroup = useCallback(() => {
    if (currentClass) {
      if (currentClass.headTutor.id === userId) {
        return 'headTutor';
      } else if (currentClass.studentIds.includes(userId)) {
        return 'students';
      } else if (currentClass.tutorIds.includes(userId)) {
        return 'tutors';
      }
    }
  }, [userId, currentClass]);

  const populateLevelUpExp = useCallback(() => {
    if (currentClass) {
      getLevellingSettings(currentClass.id)
        .then((settings) => {
          setlevelUpExp(settings.expRequirements)
        })
    }
  }, [currentClass, getLevellingSettings]);

  const populateUser = useCallback(() => {
    if (userId && currentClass) {
      const userGroup = getUserGroup();
      if (userGroup === 'headTutor') {
        setUser({ id: userId, name: currentClass.headTutor.name });
      } else {
        getUser(currentClass.id, userGroup, userId)
          .then((user) => {
            setUser(user);
          }).then(() => {
            populateLevelUpExp();
          });
      }
    }
  }, [userId, currentClass, getUserGroup, populateLevelUpExp, getUser]);

  useEffect(() => {
    populateUser();
  }, [populateUser]);

  return (
    <>
      <div className="p-4 slate-700 d-flex flex-column gap-2">
        <h2>
          <strong>{user.name}</strong>
        </h2>
        <div>
          {user.level !== undefined ? `Level: ${user.level}` : ''}
        </div>
        <div>
          {user.exp !== undefined ? `EXP: ${user.exp} / ${levelUpExp[user.level]}` : ''}
        </div>
        <div>
          {user.overallCounts !== undefined ? `Total posts: ${user.overallCounts.posts}` : ''}
        </div>
        <div>
          {user.overallCounts !== undefined ? `Total votes: ${user.overallCounts.votes}` : ''}
        </div>
        <div>
          {user.overallCounts !== undefined ? `Total feedbacks given: ${user.overallCounts.feedbacks}` : ''}
        </div>
        {/* <div>
          {user.overallCounts !== undefined ? `Total quizzes attended: ${user.overallCounts.quizzesAttended}` : ''}
        </div> */}
        <div>
          {user.overallCounts !== undefined ? `Total correct quiz answers: ${user.overallCounts.quizCorrectAnswers}` : ''}
        </div>
      </div>
      <br />
      <Achievements user={user} />
    </>
  );
}