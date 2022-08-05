import React, { useState, useRef, useEffect, useCallback } from "react";
import WebPage from "../components/WebPage";
import Button from "../components/Button";
import AddQuestions from "../components/AddQuestions";

import { useClass } from "../contexts/ClassContext";
import { Card, Container, Form, FormControl } from "react-bootstrap";
import firestore from "../firestore";
import { Link } from "react-router-dom";

export default function CreateQuiz() {
  const { currentClass } = useClass();
  const { createQuiz } = firestore;
  const [addingQuestions, setAddingQuestions] = useState(false);
  const nameRef = useRef();

  const handleCreateQuiz = useCallback(() => {
    if (nameRef.current.value === "") {
      return;
    }
    createQuiz(currentClass.id, nameRef.current.value);
    setAddingQuestions(true);
  }, [currentClass.id, createQuiz]);

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
  }, [handleCreateQuiz]);

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
          <div className="d-flex justify-content-center">
            <Link to="/quiz-dashboard">
              <Button
                className="mt-3 light-button"
                style={{ minWidth: "330px" }}
              >
                Back to quiz dashboard
              </Button>
            </Link>
          </div>
        </Container>
      )}
    </WebPage>
  );
}
