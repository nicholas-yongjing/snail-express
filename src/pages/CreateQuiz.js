import React, { useState, useRef, useEffect } from "react";
import WebPage from "../components/WebPage";
import Button from "../components/Button";
import AddQuestions from "../components/AddQuestions";

import { useClass } from "../contexts/ClassContext";
import { Card, Container, Form, FormControl } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

export default function CreateQuiz() {
  const { currentClass } = useClass();
  const [addingQuestions, setAddingQuestions] = useState(false);
  const nameRef = useRef();

  const handleCreateQuiz = () => {
    if (nameRef.current.value === "") {
      return;
    }
    setDoc(
      doc(
        firestore,
        "classes",
        currentClass.id,
        "quizzes",
        `${nameRef.current.value}`
      ),
      { live: false, offline: false, currentQuestion: 0 }
    ).then(console.log("Setting quiz name"));
    setAddingQuestions(true);
  };

  useEffect(() => {
    // Form submits when enter is pressed
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
                  <AddQuestions name={nameRef.current.value} />
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
                <FormControl ref={nameRef}></FormControl>
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
