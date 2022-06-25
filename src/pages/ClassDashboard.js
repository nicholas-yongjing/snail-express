import { Link, useNavigate } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import SideBar from "../components/SideBar"
import WebPage from '../components/WebPage';
import { Button } from 'react-bootstrap';

export default function ClassDashBoard() {
  const { currentClass, setCurrentClass } = useClass();
  const navigate = useNavigate()
  const sidebarLinks = [['/class-dashboard', 'Students'],
  ['/class-dashboard', 'Tutors'],
  ['/settings-general', 'Settings']];
  function handleClick() {
    setCurrentClass(null);
  }

  return (
    <WebPage>
      <div className='flex-grow-1 d-flex'>
        <SideBar>
          {
            sidebarLinks.map(([link, text]) => {
              return (
                <Link
                  to={link}
                  key={text}
                  className='btn w-100 generic-button d-flex justify-content-center'
                >
                  {text}
                </Link>
              );
            })
          }
        </SideBar>
        <div className='d-flex justify-content-between p-4 w-100 text-slate-200'>
          <span className='fs-1'>
            {currentClass ? currentClass.className : ''}
          </span>
          <span>
            <Link to='/dashboard'>
              <button className='btn generic-button-light fs-4' onClick={handleClick}>
                Back to dashboard
              </button>
            </Link>
          </span>
        </div>
      </div>
    </WebPage>

  );
}