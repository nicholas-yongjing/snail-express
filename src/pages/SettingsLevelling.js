import { Link } from "react-router-dom";
import { changeLevellingSettings, getLevellingSettings } from "../database";
import WebPage from "../components/WebPage";
import SettingsSideBar from "../components/SettingsSideBar";
import Button from "../components/Button";
import { Form, Alert } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import Header from "../components/Header";

export default function SettingsLevelling() {
  const { currentClass } = useClass();
  const [expRequirements, setExpRequirements] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const formRef = useRef();
  const expRequirementsRef = useRef();

  useEffect(() => {
    populateExpRequirements();
  }, []);

  function populateExpRequirements() {
    if (currentClass) {
      getLevellingSettings(currentClass.id).then((requestedSettings) => {
        setExpRequirements(requestedSettings['expRequirements']);
      })
    }
  }

  function validateRequirements(requirements) {
    for (const exp of requirements) {
      if (isNaN(exp)) {
        return false;
      }
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const newExpRequirements = expRequirementsRef.current.value
      .split(/\s+/).map((num) => parseInt(num));
    if (!validateRequirements(newExpRequirements)) {
      setError('Invalid exp requirements! Please enter integers separated by whitespace');
    } else {
      changeLevellingSettings(
        currentClass.id,
        {'expRequirements': newExpRequirements}
      ).then(() => {
        populateExpRequirements();
        setMessage('Settings saved')
      }).catch(() => {
        setError('Error updating settings. Please try again later');
      });
    }
    setLoading(false);
  }

  return (
    <WebPage>
      <div className="flex-grow-1 d-flex">
        <SettingsSideBar />
       <div className="w-100 p-4 text-slate-200 fs-5 d-flex flex-column gap-4">
          <Header
            headerText="Levelling Settings"
            buttonText="Back to class dashboard"
            linkTo="/class-dashboard"
            buttonClass="light-button"
          />
          <div className="rounded p-4 d-flex flex-column slate-700">
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>} 
          <Form
            className="d-flex justify-content-between"
            ref={formRef}
            onSubmit={handleSubmit}  
          >    
           <div className="d-flex gap-4">
              <div>
                <div className="fs-4">
                  Level
                </div>
                <div className="p-1 text-slate-700">____</div>
                {
                  [...Array(100).keys()].map((index) => {
                    return (
                      <div key={index} className="text-right">
                        {index + 1}
                      </div>
                    );
                  })
                }
              </div>
              <div>
                <div className="fs-4">
                  Cumulative exp to reach level
                </div>
                <br></br>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    size='lg'
                    rows={100}
                    ref={expRequirementsRef}
                    required
                    className="generic-field"
                    defaultValue={expRequirements.join("\n")}
                  />
                </Form.Group>
              </div>
            </div>
            <Button
              disabled={loading}
              className="w-25 align-self-start create-button"
              type="submit"
            >
              Save Settings
            </Button>
          </Form>
 
          </div>
       </div>
      </div>
    </WebPage>
  );
}