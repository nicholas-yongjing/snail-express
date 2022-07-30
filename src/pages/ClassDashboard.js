import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClass } from '../contexts/ClassContext';
import SideBar from "../components/SideBar"
import WebPage from '../components/WebPage';
import Header from '../components/Header';
import User from '../components/User';

export default function ClassDashBoard() {
  const { currentUser } = useAuth();
  const { currentClass, setCurrentClass } = useClass();
  const sidebarLinks = [
    ['/forums', 'Forums'],
    ['/quiz-dashboard', 'Quizzes'],
    ['/live-feedback', 'Live Feedback'],
    ['/students', 'Students'],
    ['/tutors', 'Tutors'],
    ['/settings', 'Settings']];

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
          <br />
          <User userId={currentUser.uid} />
        </div>
      </div>
    </WebPage>
  );
}