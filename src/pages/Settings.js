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
                <Button
                  key={category}
                  onClick={() => handleChangeCategory(category)}
                >
                  {category}
                </Button>
              );
            })
          }
        </SideBar>
        <div className="w-100 p-4 d-flex flex-column gap-4">
          <Header
            headerText={settingsCategory +" Settings"}
            buttonText="Back to class dashboard"
            linkTo="/class-dashboard"
            buttonClass="light-button"
          />
          <div className="rounded p-4 d-flex flex-column gap-4">
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