import { Link } from "react-router-dom";
import WebPage from "../components/WebPage";
import SideBar from "../components/SideBar";
import Button from "../components/Button";

export default function SettingsGeneral() {
  const sidebarLinks = [['/settings-general', 'General'],
  ['/settings-forums', 'Forum']];
  return (
    <WebPage>
      <div className="flex-grow-1 d-flex slate-800">
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
        <div className="w-100 p-4 text-slate-200 fs-5">
          <div className="d-flex justify-content-between">
            <h1>
              General Settings
            </h1>
            <Link to="/class-dashboard">
              <Button className="light-button"> 
                Back to class dashboard
              </Button>
            </Link>
          </div>
          No settings available
        </div>
      </div>
    </WebPage>
  );
}