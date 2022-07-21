import React, { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { Card, Container, Form, FormControl } from "react-bootstrap";
import WebPage from "./WebPage";
import AddQuestions from "./AddQuestions";
import { firestore } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useClass } from "../contexts/ClassContext";

export default function CreateQuiz() {
  const { currentClass } = useClass();
  const quizNameRef = useRef();
  const [addingQuestions, setAddingQuestions] = useState(false);

  const handleCreateQuiz = () => {
    if (quizNameRef.current.value === "") {
      return;
    }
    const quizDocRef = doc(
      firestore,
      "classes",
      currentClass.id,
      "quizzes",
      `${quizNameRef.current.value}`
    );
    setDoc(quizDocRef, { live: false, offline: true, currentQuestion: 0 }).then(
      console.log("Setting quiz name")
    );
    setAddingQuestions(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCreateQuiz();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <WebPage>
      {addingQuestions ? (
        <div className="d-flex flex-column">
          <Container className="mt-3 d-flex flex-column">
            <Card className="slate-600 text-slate-200 fs-4">
              <div className="d-flex justify-content-center">
                <div>
                  <AddQuestions name={quizNameRef.current.value} />
                </div>
              </div>
            </Card>
          </Container>
        </div>
      ) : (
        <Container className="mt-3 d-flex flex-column">
          <Card className="slate-600 text-slate-200 fs-4">
            <div className="d-flex justify-content-center">
              <div
                className="slate-600 text-slate-200 fs-4 mt-3 d-flex flex-column justify-content-center"
                style={{ maxWidth: "500px" }}
              >
                <Form.Label className="d-flex justify-content-center">
                  Enter the title of your new quiz!
                </Form.Label>
                <FormControl ref={quizNameRef}></FormControl>
                <Button onClick={handleCreateQuiz} className="mt-3 mb-3">
                  Start
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      )}
    </WebPage>
  );
}
