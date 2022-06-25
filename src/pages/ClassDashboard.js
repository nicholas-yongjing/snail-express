import { Link, useNavigate } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import SideBar from "../components/SideBar"
import WebPage from '../components/WebPage';

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
                  className='d-flex justify-content-center'
                >
                  <button type='button' className='btn w-100 btn-primary align-self-center'>
                    {text}
                  </button>
                </Link>
              );
            })
          }
        </SideBar>
        <div className='d-flex justify-content-between p-4 w-100'>
          <span className='fs-1'>{currentClass ? currentClass.className : ''} </span>
          <span>
            <Link to='/dashboard'>
              <button className='btn btn-secondary fs-4' onClick={handleClick}>
                Back to dashboard
              </button>
            </Link>
          </span>
        </div>
      </div>
    </WebPage>

  );
}