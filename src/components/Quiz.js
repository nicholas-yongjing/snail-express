import React, { useState, useEffect } from "react";
import Button from "./Button";
import { useClass } from "../contexts/ClassContext";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function Quiz(props) {
  const { currentQuiz } = props;
  const { currentClass } = useClass();
  const [controls, setControls] = useState({});

  const { live, currentQuestion } = controls;

  const name = currentQuiz.id;
  const questions = currentQuiz.data.map((doc) => doc.data());

  const controlsRef = doc(
    firestore,
    "classes",
    currentClass.id,
    "quizzes",
    name,
    "questions",
    "0"
  );

  useEffect(() => {
    getDoc(controlsRef).then((doc) => setControls(doc.data())); // Localise controls
    const unsubscribe = () => setDoc(controlsRef, {
      currentQuestion: 1,
      live: false,
    });
    return unsubscribe;
  }, []);

  const handleToggleQuiz = () => {
    setDoc(doc(firestore, "classes", currentClass.id, "quizzes", "live"), {
      name: name,
    });
    updateDoc(controlsRef, { ...controls, live: !live });
    setControls((prevState) => ({
      ...prevState,
      live: !live,
    }));
  };

  const handlePrevious = () => {
    // always update locally first before pushing onto DB
    updateDoc(controlsRef, {
      ...controls,
      currentQuestion: currentQuestion - 1,
    });
    setControls((prevState) => ({
      ...prevState,
      currentQuestion: currentQuestion - 1,
    }));
  };

  const handleNext = () => {
    // always update locally first before pushing onto DB
    updateDoc(controlsRef, {
      ...controls,
      currentQuestion: currentQuestion + 1,
    });
    setControls((prevState) => ({
      ...prevState,
      currentQuestion: currentQuestion + 1,
    }));
  };

  return (
    <div>
      <h3>{name}</h3>
      <Button className="mt-3" onClick={handleToggleQuiz}>
        {controls.live ? <div>End quiz</div> : <div>Start quiz</div>}
      </Button>
      <div>
        {controls.live ? (
          <div className="slate-600" style={{ margin: "16px" }}>
            <div>
              <h3 className="p-3" style={{ margin: "8px" }}>
                Question {currentQuestion}
              </h3>
              <h4 className="slate-800 p-4" style={{ margin: "8px" }}>
                {questions[currentQuestion].question}
              </h4>
            </div>
            <div>
              <span className="d-flex justify-content-between">
                <div className="slate-800 p-4" style={{ margin: "8px" }}>
                  Option A: {questions[currentQuestion].A}
                </div>
                <div className="slate-800 p-4" style={{ margin: "8px" }}>
                  Option B: {questions[currentQuestion].B}
                </div>
                <div className="slate-800 p-4" style={{ margin: "8px" }}>
                  Option C: {questions[currentQuestion].C}
                </div>
                <div className="slate-800 p-4" style={{ margin: "8px" }}>
                  Option D: {questions[currentQuestion].D}
                </div>
              </span>
              <br></br>
              <span className="d-flex justify-content-between">
                <Button
                  className="slate-800"
                  style={{ margin: "8px" }}
                  onClick={handlePrevious}
                  disabled={currentQuestion <= 1}
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
        ) : (
          <div>Quiz has not been started</div>
        )}
      </div>
    </div>
  );
}
