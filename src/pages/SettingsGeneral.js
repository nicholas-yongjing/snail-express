import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import WebPage from "../components/WebPage";
import Button from "../components/Button";
import SettingsSideBar from "../components/SettingsSideBar";
import { useClass } from "../contexts/ClassContext";

export default function SettingsGeneral() {
  const { currentClass, changeClassName } = useClass();
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const classNameRef = useRef();

  useEffect(() => {
    setClassName(currentClass.className);
  }, [currentClass]);

  function handleUpdateClassName(event) {
    event.preventDefault();
    changeClassName(classNameRef.current.value);
  }

  return (
    <WebPage>
      <div className="flex-grow-1 d-flex">
        <SettingsSideBar /> 
        <div className="w-100 p-4 text-slate-200 fs-5 d-flex flex-column gap-4">
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
          <Form className="p-4 fs-4 d-flex align-items-end gap-2 slate-700" onSubmit={handleUpdateClassName}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group>
                <Form.Label>Class Name</Form.Label>
                <Form.Control
                  className="generic-field"
                  size='lg'
                  type="text"
                  ref={classNameRef}
                  required
                  defaultValue={className}/>
              </Form.Group>
              <Button className="light-button" disabled={loading} type="submit">
                Update class name
              </Button>
            </Form>
        </div>
      </div>
    </WebPage>
  );
}