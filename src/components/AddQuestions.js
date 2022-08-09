import React, { useState, useRef } from "react";
import Button from "../components/Button";
import firestore from "../firestore";

import { Link } from "react-router-dom";
import { Form, Dropdown, DropdownButton, Alert } from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";

export default function AddQuestions(props) {
  const { createQuestion } = firestore;
  const { name } = props;
  const { currentClass } = useClass();
  const [count, setCount] = useState(1);
  const [alert, setAlert] = useState(false);

  const questionRef = useRef();
  const aRef = useRef();
  const bRef = useRef();
  const cRef = useRef();
  const dRef = useRef();

  const options = ["A", "B", "C", "D"];

  const handleAddQuestion = (event, answer) => {
    event.preventDefault();
    if ( 
      questionRef.current.value === "" ||
      aRef.current.value === "" ||
      bRef.current.value === "" ||
      cRef.current.value === "" ||
      dRef.current.value === ""
    ) {
      setAlert(true);
      return;
    }
    setAlert(false);
    const questionObj = {
      question: questionRef.current.value,
      A: aRef.current.value,
      B: bRef.current.value,
      C: cRef.current.value,
      D: dRef.current.value,
      answer: answer,
      id: count,
      responses: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        total: 0,
      },
    };
    createQuestion(currentClass.id, name, count, questionObj);
    setCount(count + 1);
    resetRefs();
  };

  const resetRefs = () => {
    aRef.current.value = "";
    bRef.current.value = "";
    cRef.current.value = "";
    dRef.current.value = "";
    questionRef.current.value = "";
  };

  return count > 10 ? (
    <div className="d-flex flex-column align-items-center">
      <div className="mt-3">Max question limit reached!</div>
      <Link to="/quiz-dashboard">
        <Button className="mt-3 mb-3">Proceed to quiz list</Button>
      </Link>
    </div>
  ) : (
    <div>
      <div className="text-slate-300">
        {alert && (
          <Alert variant="danger" className="mt-3">
            Please fill in all fields!
          </Alert>
        )}
        <div data-testid="count" variant="info" className="fs-5 mt-2">
          {count - 1 + "/10 questions added so far"}
        </div>
      </div>
      <div className="d-flex flex-row-reverse">
        {count > 1 ? (
          <Link to="/quiz-dashboard">
            <Button>Finish and exit</Button>
          </Link>
        ) : (
          <Button disabled={true}>Finish and exit</Button>
        )}
      </div>
      <Form className="d-flex flex-column align-items-center">
        <Form.Group>
          <div style={{ margin: "6px" }}>
            <Form.Label className="text-slate-200 p-2">Question:</Form.Label>
            <Form.Control
              as="textarea"
              ref={questionRef}
              rows={3}
              required
              placeholder="Enter a question here to test your students' knowledge"
              className="generic-field"
            />
          </div>
          <div className="d-flex" style={{ margin: "6px" }}>
            <Form.Label
              className="text-slate-200 p-2"
              style={{ minWidth: "120px" }}
            >
              Option A:
            </Form.Label>
            <Form.Control
              required
              ref={aRef}
              placeholder="Possible option"
              className="generic-field"
            />
            <Form.Label
              className="text-slate-200 p-2"
              style={{ minWidth: "120px" }}
            >
              Option B:
            </Form.Label>
            <Form.Control
              required
              ref={bRef}
              placeholder="Possible option"
              className="generic-field"
            />
          </div>
          <div className="d-flex" style={{ margin: "6px" }}>
            <Form.Label
              className="text-slate-200 p-2"
              style={{ minWidth: "120px" }}
            >
              Option C:
            </Form.Label>
            <Form.Control
              required
              ref={cRef}
              placeholder="Possible option"
              className="generic-field"
            />
            <Form.Label
              className="text-slate-200 p-2"
              style={{ minWidth: "120px" }}
            >
              Option D:
            </Form.Label>
            <Form.Control
              required
              ref={dRef}
              placeholder="Possible option"
              className="generic-field"
            />
          </div>
        </Form.Group>
        <DropdownButton title="Correct option" className="mt-3 mb-3">
          {options.map((option) => (
            <Dropdown.Item
              key={option}
              onClick={(event) => handleAddQuestion(event, option)}
            >
              {option}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Form>
    </div>
  );
}
