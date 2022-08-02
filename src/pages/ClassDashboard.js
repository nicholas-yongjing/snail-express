import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClass } from '../contexts/ClassContext';
import SideBar from "../components/SideBar"
import WebPage from '../components/WebPage';
import Header from '../components/Header';
import User from '../components/User';
import ForumsImg from '../images/forums.svg';
import QuizImg from '../images/quiz.svg';
import FeedbackImg from '../images/feedback.svg';
import StudentsImg from '../images/students.svg';
import TutorsImg from '../images/tutors.svg';
import SettingsImg from '../images/settings.svg';

export default function ClassDashBoard() {
  const { currentUser } = useAuth();
  const { currentClass, setCurrentClass } = useClass();
  const sidebarLinks = [
    ['/forums', ForumsImg, 'Forums'],
    ['/quiz-dashboard', QuizImg, 'Quizzes'],
    ['/live-feedback', FeedbackImg, 'Live Feedback'],
    ['/students', StudentsImg, 'Students'],
    ['/tutors', TutorsImg, 'Tutors'],
    ['/settings', SettingsImg, 'Settings']];

  function handleClick() {
    setCurrentClass(null);
  }

  return (
    <WebPage>
      <div className='flex-grow-1 justify-self-stretch d-flex text-slate-200 fs-5'>
        <SideBar>
          {
            sidebarLinks.map(([link, logo, text]) => {
              return (
                <div 
                  key={text}
                  className='d-flex gap-4'
                >
                  <img
                    src={logo}
                    alt={text}
                    className='filter-slate-200'
                    style={{ width: '40px' }}
                  />
                  <Link
                    to={link}
                    className='btn fs-4 w-100 generic-button d-flex justify-content-center align-items-center'
                  >
                    {text}
                  </Link>
                </div>

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