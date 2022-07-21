import React, { useState, useEffect } from "react";
import Button from "./Button";
import Statistics from "./Statistics";
import { useClass } from "../contexts/ClassContext";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDocs,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function TutorQuizInterface(props) {
  const { setShowQuiz, currentQuiz } = props;
  const { currentClass, setCurrentClass } = useClass();
  const [controls, setControls] = useState({});
  const navigate = useNavigate();

  const { offline, live, currentQuestion } = controls;

  useEffect(() => {
    console.log("inside use effect");
    const unsubscribe = onSnapshot(
      doc(firestore, "classes", currentClass.id, "quizzes", name),
      (doc) => {
        setControls(doc.data());
      }
    );

    return unsubscribe;
  }, []);

  const name = currentQuiz.id;
  const questions = currentQuiz.data.map((doc) => doc.data());

  const handleStartQuiz = () => {
    updateDoc(doc(firestore, "classes", currentClass.id, "quizzes", name), {
      live: true,
      currentQuestion: 0,
    });
    getDocs(
      collection(
        firestore,
        "classes",
        currentClass.id,
        "quizzes",
        name,
        "questions"
      )
    ).then((snapshot) => {
      snapshot.docs.map((question) => {
        updateDoc(doc(firestore, question.ref.path), {
          responses: {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            total: 0,
          },
        });
      });
    });
  };

  const handleEndQuiz = () => {
    updateDoc(doc(firestore, "classes", currentClass.id, "quizzes", name), {
      live: false,
      currentQuestion: 0,
    });
    getDocs(
      collection(
        firestore,
        "classes",
        currentClass.id,
        "quizzes",
        name,
        "questions"
      )
    ).then((snapshot) => {
      snapshot.docs.map((question) => {
        updateDoc(doc(firestore, question.ref.path), {
          responses: {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            total: 0,
          },
        });
      });
    });
  };

  const handlePrevious = () => {
    updateDoc(doc(firestore, "classes", currentClass.id, "quizzes", name), {
      currentQuestion: currentQuestion - 1,
    });
  };

  const handleNext = () => {
    updateDoc(doc(firestore, "classes", currentClass.id, "quizzes", name), {
      currentQuestion: currentQuestion + 1,
    });
  };

  const toggleSetOffline = () => {
    updateDoc(doc(firestore, "classes", currentClass.id, "quizzes", name), {
      offline: !offline,
    });
  };

  const handleDeleteQuiz = () => {
    setShowQuiz(false);
    // setTimeout(
    //   () =>
    //     deleteDoc(doc(firestore, "classes", currentClass.id, "quizzes", name)),
    //   500
    // );
    deleteDoc(doc(firestore, "classes", currentClass.id, "quizzes", name))
  };

  return (
    <div>
      <h3>{name}</h3>
      {live ? (
        <Button onClick={handleEndQuiz}>End quiz</Button>
      ) : (
        <Button onClick={handleStartQuiz}>Start quiz</Button>
      )}
      {!live &&
        (offline ? (
          <Button onClick={toggleSetOffline}>
            Remove from offline quizzes
          </Button>
        ) : (
          <Button onClick={toggleSetOffline}>Make available offline</Button>
        ))}
      {!live && <Button onClick={handleDeleteQuiz}>Delete quiz</Button>}
      <div>
        {live && (
          <div className="slate-600 p-4" style={{ margin: "16px" }}>
            <div>
              <h3 className="p-3" style={{ margin: "8px" }}>
                Question {currentQuestion + 1}
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
        )}
      </div>
      {live && (
        <Statistics
          name={name}
          currentClass={currentClass}
          currentQuestion={currentQuestion}
          setCurrentClass={setCurrentClass}
        />
      )}
    </div>
  );
}
