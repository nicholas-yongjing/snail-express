import { useCallback, useEffect, useMemo, useRef } from "react";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Form } from "react-bootstrap";
import Button from "./Button";

export default function SettingsLevelling(props) {
  const { currentClass } = useClass();
  const { changeLevellingSettings, getLevellingSettings } = firestore;
  const postLimitRef = useRef();
  const voteLimitRef = useRef();
  const postExpRef = useRef();
  const voteExpRef = useRef();
  const limits = useMemo(() => {
    return (
      [{ key: 'posts', label: 'post', ref: postLimitRef },
      { key: 'votes', label: 'vote', ref: voteLimitRef }]
    );
  }, []);

  const expGains = useMemo(() => {
    return (
      [{ key: 'posts', label: 'post', ref: postExpRef },
      { key: 'votes', label: 'vote', ref: voteExpRef }]
    );
  }, []);

  const expRequirementsRef = useRef();
  const { setMessage, setError, loading, setLoading } = props;

  const populateSettings = useCallback(() => {
    if (currentClass) {
      getLevellingSettings(currentClass.id).then((requestedSettings) => {
        expRequirementsRef.current.value = requestedSettings.expRequirements.join("\n");
        for (const limit of limits) {
          limit.ref.current.value = requestedSettings.limits[limit.key];
        }
        for (const expGain of expGains) {
          expGain.ref.current.value = requestedSettings.expGain[expGain.key];
        }
      })
    }
  }, [limits, expGains, currentClass, getLevellingSettings]);

  useEffect(() => {
    populateSettings();
  }, [populateSettings]);

  function validatePostiveIntegers(obj) {
    for (const value of Object.values(obj)) {
      if ((isNaN(value)) || value <= 0) {
        console.log(value)
        return false;
      }
    }
    return true;
  }

  function validateRequirements(requirements) {
    if (requirements.length !== 100 || isNaN(requirements[0])) {
      return false;
    }
    for (let i = 1; i < 100; i++) {
      if (isNaN(requirements[i]) || requirements[i - 1] > requirements[i]) {
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
    const newLimits = {};
    for (const limit of limits) {
      newLimits[limit.key] = parseInt(limit.ref.current.value);
    }
    const newExpGains = {};
    for (const expGain of expGains) {
      newExpGains[expGain.key] = parseInt(expGain.ref.current.value);
    }
    const newExpRequirements = expRequirementsRef.current.value
      .split(/\s+/).map((num) => parseInt(num));

    if (!(validatePostiveIntegers(newLimits) && validatePostiveIntegers(newExpGains))) {
      setError('Invalid limits and EXP gain! Limits and EXP gain must be positive integers');
      setLoading(false);
    } else if (!validateRequirements(newExpRequirements)) {
      setError('Invalid exp requirements! Please enter 100 non-decreasing integers separated by whitespace');
      setLoading(false);
    } else {
      changeLevellingSettings(
        currentClass.id,
        {
          limits: newLimits,
          expGain: newExpGains,
          expRequirements: newExpRequirements
        }
      ).then(() => {
        populateSettings();
        setMessage('Settings updated')
      }).catch(() => {
        setError('Error updating settings. Please try again later');
      }).finally(() => setLoading(false));
    }
  }

  return (
    <div className="rounded slate-700">
      <div className="fs-5 m-4">
        * When EXP requirements change, students' level will only update after gaining EXP. Students' level does not decrease.
      </div>
      <Form className="p-4 d-flex flex-column gap-4"
        onSubmit={handleSubmit}
      >
        <Button
          disabled={loading}
          className="w-25 align-self-center create-button"
          type="submit"
        >
          Update
        </Button>
        <div>
          {
            limits.map((limit) => {
              return (
                <Form.Group key={limit.key}>
                  <Form.Label>
                    Daily {limit.label} limit awarding EXP
                  </Form.Label>
                  <Form.Control
                    className="generic-field"
                    ref={limit.ref}
                    required
                  />
                </Form.Group>
              );
            })
          }
          {
            expGains.map((expGain) => {
              return (
                <Form.Group key={expGain.key}>
                  <Form.Label>
                    EXP awarded per {expGain.label}
                  </Form.Label>
                  <Form.Control
                    className="generic-field"
                    ref={expGain.ref}
                    required
                  />
                </Form.Group>
              );
            })
          }
        </div>
        <div className="d-flex gap-4">
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
            </div>
            <Form.Group>
              <Form.Control
                as="textarea"
                size='lg'
                rows={100}
                ref={expRequirementsRef}
                required
                className="generic-field"
              />
            </Form.Group>
          </div>
        </div>
      </Form>
    </div>
  );
}