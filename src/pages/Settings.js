import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { Alert } from "react-bootstrap";
import WebPage from "../components/WebPage";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import SettingsGeneral from "../components/SettingsGeneral";
import SettingsLevelling from "../components/SettingsLevelling";
import SettingsForums from "../components/SettingsForums";
import Button from "../components/Button";
import GeneralImg from "../images/general.svg"
import LevellingImg from "../images/levelling.svg"
import ForumsImg from "../images/forums.svg"

export default function Settings() {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const [role, setRole] = useState();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const componentProps =
    { setMessage, setError, loading, setLoading, role };
  const settingCategories =
  {
    'General': <SettingsGeneral {...componentProps} />,
    'Levelling': <SettingsLevelling {...componentProps} />,
    'Forums': <SettingsForums {...componentProps} />
  };
  const [settingsCategory, setSettingsCategory] = useState('General');
  const settingLogos =
  {
    'General': GeneralImg,
    'Levelling': LevellingImg,
    'Forums': ForumsImg
  };


  const populateRole = useCallback(() => {
    if (currentUser && currentClass) {
      if (currentUser.uid === currentClass.headTutor.id) {
        setRole('head tutor');
      } else if (currentClass.tutorIds.includes(currentUser.uid)) {
        setRole('tutor');
      } else {
        setRole('student');
      }
    }
  }, [currentUser, currentClass])

  useEffect(() => {
    populateRole();
  }, [populateRole])

  function handleChangeCategory(category) {
    setSettingsCategory(category)
    setMessage('');
    setError('');
  }

  return (
    <WebPage>
      <div className="flex-grow-1 d-flex">
        <SideBar>
          {
            Object.keys(settingCategories).map((category) => {
              return (
                <div
                  className="align-self-stretch d-flex gap-4"
                  key={category}
                >
                  <img
                    src={settingLogos[category]}
                    alt={category}
                    className="filter-slate-200"
                    style={{ width: '40px' }}
                  />
                  <Button

                    onClick={() => handleChangeCategory(category)}
                    className="flex-grow-1"
                  >
                    {category}
                  </Button>

                </div>
              );
            })
          }
        </SideBar>
        <div className="w-100 p-4 d-flex flex-column gap-4 rounded">
          <Header
            headerText={settingsCategory + " Settings"}
            buttonText="Back to class dashboard"
            linkTo="/class-dashboard"
            buttonClass="light-button"
          />
          <div className="rounded p-4 d-flex flex-column gap-4 rounded">
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            {
              settingCategories[settingsCategory]
            }
          </div>
        </div>
      </div>
    </WebPage>
  );
}