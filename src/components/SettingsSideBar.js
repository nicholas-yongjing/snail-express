import { Link } from "react-router-dom";
import SideBar from "./SideBar";

export default function SettingsSideBar() {
  const sidebarLinks = [
    ['/settings-general', 'General'],
    ['/settings-levelling', 'Levelling'],
    ['/settings-forums', 'Forum']];

  return (
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
  );
}