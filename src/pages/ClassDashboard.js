import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClass } from '../contexts/ClassContext';
import firestore from '../firestore';
import SideBar from "../components/SideBar"
import WebPage from '../components/WebPage';
import Header from '../components/Header';

export default function ClassDashBoard() {
  const { currentUser } = useAuth();
  const { currentClass, setCurrentClass } = useClass();
  const { getLevellingSettings, getUser } = firestore;
  const [classUser, setClassUser] = useState({});
  const [levelUpExp, setlevelUpExp] = useState([]);
  const sidebarLinks = [['/students', 'Students'],
  ['/tutors', 'Tutors'],
  ['/settings', 'Settings']];

  const populateLevelUpExp = useCallback(() => {
    if (currentClass) {
      getLevellingSettings(currentClass.id).then((settings) => {
        setlevelUpExp(settings.expRequirements)
      })
    }
  }, [currentClass]);

  const getRole = useCallback(() => {
    if (currentUser && currentClass) {
      if (currentClass.headTutor.id === currentUser.uid) {
        return 'headTutor';
      } else if (currentClass.studentIds.includes(currentUser.uid)) {
        return 'student';
      } else if (currentClass.tutorIds.includes(currentUser.uid)) {
        return 'tutor';
      }
    }
  }, [currentUser, currentClass]);

  const populateClassUser = useCallback(() => {
    if (currentUser.uid && currentClass.id) {
      const role = getRole();
      if (role === 'headTutor' || role === 'tutor') {
        setClassUser({ id: currentUser.uid, name: currentUser.displayName });
      } else if (role === 'student') {
        getUser(currentClass.id, 'students', currentUser.uid).then((user) => {
          setClassUser(user);
        }).then(() => {
          populateLevelUpExp();
        });
      }
    }
  }, [currentUser.uid, currentUser.displayName, currentClass.id, getRole, populateLevelUpExp]);

  useEffect(() => {
    populateClassUser();
  }, [populateClassUser]);

  function handleClick() {
    setCurrentClass(null);
  }

  return (
    <WebPage>
      <div className='flex-grow-1 justify-self-stretch d-flex text-slate-200 fs-5'>
        <SideBar>
          {
            sidebarLinks.map(([link, text]) => {
              return (
                <Link
                  to={link}
                  key={text}
                  className='btn fs-4 w-100 generic-button d-flex justify-content-center'
                >
                  {text}
                </Link>
              );
            })
          }
        </SideBar>
        <div className='flex-grow-1 p-4'>
          <Header
            headerText={currentClass ? currentClass.className : ''}
            buttonText="Back to dashboard"
            linkTo="/dashboard"
            handleClick={handleClick}
            buttonClass="light-button"
          />
          <h2>
            <strong>{classUser.name}</strong>
          </h2>
          <div>
            {classUser.level !== undefined ? `Level: ${classUser.level}` : ''}
          </div>
          <div>
            {classUser.exp !== undefined ? `EXP: ${classUser.exp} / ${levelUpExp[classUser.level]}` : ''}
          </div>
        </div>
      </div>
    </WebPage>

  );
}