import React, { useState, useEffect } from "react";
import Button from "./Button";
import Statistics from "./Statistics";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function TutorQuizInterface(props) {
  const { setShowQuiz, currentQuiz } = props;
  const { currentClass } = useClass();
  const {
    activateQuiz,
    deactivateQuiz,
    showNextQuestion,
    showPreviousQuestion,
    toggleRevision,
    deleteQuiz,
  } = firestore;
  const [controls, setControls] = useState({});

  const { revision, live, currentQuestion } = controls;
  const name = currentQuiz.id;
  const questions = currentQuiz.data.map((doc) => doc.data());

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "classes", currentClass.id, "quizzes", name),
      (doc) => {
        setControls(doc.data());
      }
    );

    return unsubscribe;
  }, [currentClass.id, name]);

  const handleStartQuiz = () => {
    activateQuiz(currentClass.id, name);
  };

  const handleEndQuiz = () => {
    deactivateQuiz(currentClass.id, name);
  };

  const handlePrevious = () => {
    showPreviousQuestion(currentClass.id, name);
  };

  const handleNext = () => {
    showNextQuestion(currentClass.id, name);
  };

  const toggleSetRevision = () => {
    toggleRevision(currentClass.id, name, revision);
  };

  const handleDeleteQuiz = () => {
    setShowQuiz(false);
    deleteQuiz(currentClass.id, name);
  };

  return (
    <div>
      <h1 className="p-2">{name}</h1>
      {live ? (
        <Button onClick={handleEndQuiz}>End quiz</Button>
      ) : (
        <Button onClick={handleStartQuiz}>Start quiz</Button>
      )}
      {!live &&
        (revision ? (
          <Button onClick={toggleSetRevision}>
            Remove from revision quizzes
          </Button>
        ) : (
          <Button onClick={toggleSetRevision}>
            Make available for revision
          </Button>
        ))}
      {!live && <Button onClick={handleDeleteQuiz}>Delete quiz</Button>}
      <div>
        {live && (
          (questions.length > 0)
            ? <div className="slate-600 p-4 rounded" style={{ margin: "16px" }}>
              <div>
                <h3 className="p-3" style={{ margin: "8px" }}>
                  Question {currentQuestion + 1}
                </h3>
                <h4 className="slate-800 p-4 rounded" style={{ margin: "8px" }}>
                  {questions[currentQuestion].question}
                </h4>
              </div>
              <div>
                <span className="d-flex justify-content-between">
                  <div className="slate-800 p-4 rounded" style={{ margin: "8px" }}>
                    Option A: {questions[currentQuestion].A}
                  </div>
                  <div className="slate-800 p-4 rounded" style={{ margin: "8px" }}>
                    Option B: {questions[currentQuestion].B}
                  </div>
                  <div className="slate-800 p-4" style={{ margin: "8px" }}>
                    Option C: {questions[currentQuestion].C}
                  </div>
                  <div className="slate-800 p-4 rounded" style={{ margin: "8px" }}>
                    Option D: {questions[currentQuestion].D}
                  </div>
                </span>
                <br></br>
                <span className="d-flex justify-content-between">
                  <Button
                    className="slate-800"
                    style={{ margin: "8px" }}
                    onClick={handlePrevious}
                    disabled={currentQuestion <= 0}
                  >
                    Previous
                  </Button>
                  <Button
                    className="slate-800"
                    style={{ margin: "8px" }}
                    onClick={handleNext}
                    disabled={currentQuestion == questions.length - 1}
                  >
                    Show next
                  </Button>
                </span>
              </div>
            </div>
            : <h2>No questions available</h2>
        )}
      </div>
      {live && questions.length > 0 && (
        <Statistics
          name={name}
          currentClass={currentClass}
          currentQuestion={currentQuestion}
        />
      )}
    </div>
  );
}
