import { Link } from "react-router-dom";
import WebPage from "../components/WebPage";
import SettingsSideBar from "../components/SettingsSideBar";
import Button from "../components/Button";

export default function SettingsLevelling() {
  return (
    <WebPage>
      <div className="flex-grow-1 d-flex">
        <SettingsSideBar />
        <div className="w-100 p-4 text-slate-200 fs-5 d-flex flex-column gap-4">
          <div className="d-flex justify-content-between">
            <h1>
              Levelling Settings
            </h1>
            <Link to="/class-dashboard">
              <Button className="light-button">
                Back to class dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </WebPage>
  );
}