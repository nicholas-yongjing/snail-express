import WebPage from "./WebPage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Card,
  Container,
  Dropdown,
  DropdownButton,
  Form,
} from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";
import { firestore } from "../firebase";
import Button from "./Button";
import Header from "./Header";
import { doc, setDoc } from "firebase/firestore";
import { resetLectureFeedbacks } from "../database";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function EnterQuestion(props) {
  const [questionCount, setQuestionCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const questionPrompt = useRef();
  const optionA = useRef();
  const optionB = useRef();
  const optionC = useRef();
  const optionD = useRef();
  const options = ["A", "B", "C", "D"];

  const navigate = useNavigate();

  const { currentClass } = useClass();
  const quizName = props.name;

  const handleAddQuestion = (event, x) => {
    const quizDocRef = doc(
      firestore,
      "classes",
      currentClass.id,
      "quizzes",
      quizName,
      "questions",
      `${questionCount}`
    );
    setDoc(quizDocRef, {
      qn: questionPrompt.current.value,
      A: optionA.current.value,
      B: optionB.current.value,
      C: optionC.current.value,
      D: optionD.current.value,
      ans: x,
      id: questionCount
    });
    setQuestionCount(questionCount + 1);
    setSubmitted(true);
    resetRefs();
  };

  const resetRefs = () => {
    optionA.current.value = "";
    optionB.current.value = "";
    optionC.current.value = "";
    optionD.current.value = "";
    questionPrompt.current.value = "";
  };

  return questionCount >= 10 ? (
    <div className="d-flex flex-column align-items-center">
      <div className="mt-3">Max question limit reached!</div>
      <Link to="/quiz">
        <Button className="mt-3 mb-3">Proceed to quiz list</Button>
      </Link>
    </div>
  ) : (
    <div>
      {/* <div className="d-flex justify-content-center mt-3">
        {submitted ? 
          <Alert variant="success" className="fs-6">
            Question added successfully. Continue filling in the boxes to add
            more questions!
          </Alert>
          : <div></div>
        }
      </div> */}
      <div className="text-slate-300">
        <div variant="info" className="fs-5 mt-2">
          {questionCount + "/10 questions added so far"}
        </div>
      </div>
      <div className="d-flex flex-row-reverse">
        <Link to="/quiz">
          <Button>Finish and exit</Button>
        </Link>
      </div>
      {/* <Header
            headerText=""
            buttonText="Finish and exit"
            linkTo="/allquizzes"
          /> */}
      <Form className="d-flex flex-column align-items-center">
        <Form.Group>
          <Form.Label className="text-slate-200 p-2">Question:</Form.Label>
          <Form.Control
            as="textarea"
            ref={questionPrompt}
            rows={3}
            required
            placeholder="Enter a question here to test your students' knowledge"
            className="generic-field mb-3"
          />
          <div className="d-flex">
            <Form.Label
              className="text-slate-200 p-2 mb-1"
              style={{ minWidth: "120px" }}
            >
              Option A:
            </Form.Label>
            <Form.Control
              required
              ref={optionA}
              placeholder="Possible option"
              className="generic-field mb-1"
            />
            <Form.Label
              className="text-slate-200 p-2 mb-1"
              style={{ minWidth: "120px" }}
            >
              Option B:
            </Form.Label>
            <Form.Control
              required
              ref={optionB}
              placeholder="Possible option"
              className="generic-field mb-1"
            />
          </div>
          <div className="d-flex">
            <Form.Label
              className="text-slate-200 p-2 mt-2"
              style={{ minWidth: "120px" }}
            >
              Option C:
            </Form.Label>
            <Form.Control
              required
              ref={optionC}
              placeholder="Possible option"
              className="generic-field mt-2"
            />
            <Form.Label
              className="text-slate-200 p-2 mt-2"
              style={{ minWidth: "120px" }}
            >
              Option D:
            </Form.Label>
            <Form.Control
              required
              ref={optionD}
              placeholder="Possible option"
              className="generic-field mt-2"
            />
          </div>
        </Form.Group>
        <DropdownButton title="Correct option" className="mt-3 mb-3">
          {options.map((x) => (
            <Dropdown.Item
              key={x}
              onClick={(event) => handleAddQuestion(event, x)}
            >
              {x}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Form>
    </div>
  );
}
