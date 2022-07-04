import { useCallback, useEffect, useRef, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import { changeLevellingSettings, getLevellingSettings } from "../database";
import { Form } from "react-bootstrap";
import Button from "./Button";

export default function SettingsLevelling(props) {
  const { currentClass } = useClass();
  const [expRequirements, setExpRequirements] = useState([]);
  const formRef = useRef();
  const expRequirementsRef = useRef();
  const { setMessage, setError, loading, setLoading } = props;

  const populateExpRequirements = useCallback(() => {
    if (currentClass) {
      getLevellingSettings(currentClass.id).then((requestedSettings) => {
        setExpRequirements(requestedSettings['expRequirements']);
      })
    }
  }, [currentClass]);

  useEffect(() => {
    populateExpRequirements();
  }, [populateExpRequirements]);

  function validateRequirements(requirements) {
    for (const exp of requirements) {
      if (isNaN(exp)) {
        return false;
      }
    }
    return requirements.length === 100;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const newExpRequirements = expRequirementsRef.current.value
      .split(/\s+/).map((num) => parseInt(num));
    if (!validateRequirements(newExpRequirements)) {
      setError('Invalid exp requirements! Please enter 100 integers separated by whitespace');
    } else {
      changeLevellingSettings(
        currentClass.id,
        { 'expRequirements': newExpRequirements }
      ).then(() => {
        populateExpRequirements();
        setMessage('EXP requirements updated')
      }).catch(() => {
        setError('Error updating settings. Please try again later');
      });
    }
    setLoading(false);
  }

  return (
    <div className="rounded slate-700">
      <div className="fs-5 m-4">
        * When EXP requirements change, students' level will only update after gaining EXP. Students' level does not decrease.
      </div>
    <Form className="p-4 d-flex gap-4"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div>
        <div className="fs-4">
          Level
        </div>
        <div className="p-2 text-slate-700">____</div>
        {
          [...Array(100).keys()].map((index) => {
            return (
              <div key={index} className="fs-5">
                {index + 1}
              </div>
            );
          })
        }
      </div>
      <div className="flex-grow-1 d-flex flex-column gap-4">
        <div className="d-flex justify-content-between fs-4">
          <div>
            Cumulative EXP required
          </div>
          <Button
            disabled={loading}
            className="w-25 align-self-start create-button"
            type="submit"
          >
            Update
          </Button>
        </div>
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
    </Form>
 
    </div>
 );
}