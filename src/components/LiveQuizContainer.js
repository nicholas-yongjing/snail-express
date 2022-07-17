import React, { useEffect, useState } from "react";
import Button from "./Button";

import { useClass } from "../contexts/ClassContext";
import { firestore } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default function LiveQuizContainer(props) {
  const { name, questions, currentQuestion, setCurrentQuestion } = props;
  const { currentClass } = useClass();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("Inside quiz container use effect");
    const unsubscribe = onSnapshot(
      doc(
        firestore,
        "classes",
        currentClass.id,
        "quizzes",
        name,
        "questions",
        "0"
      ),
      (doc) => {
        console.log("Inside snapshot listener");
        const activeQuestion = doc.data().currentQuestion;
        setCurrentQuestion(activeQuestion);
      }
    );
    return unsubscribe;
  }, []);

  const handleSubmit = (option) => {};

  return (
    <>
      <div className="slate-600 p-4 m-4">
        <div>
            {console.log(currentQuestion)}
          <h3 className="p-3" style={{ margin: "8px" }}>
            Question {currentQuestion}
          </h3>
          <h4 className="slate-800 p-4" style={{ margin: "8px" }}>
            {questions[currentQuestion].question}
          </h4>
        </div>
        <span>
          <Button
            className="slate-800 p-3"
            style={{ margin: "8px" }}
            onClick={() => handleSubmit("A")}
            disabled={submitted}
          >
            Option A: {questions[currentQuestion].A}
          </Button>
          <Button
            className="slate-800 p-3"
            style={{ margin: "8px" }}
            onClick={() => handleSubmit("B")}
            disabled={submitted}
          >
            Option B: {questions[currentQuestion].B}
          </Button>
          <Button
            className="slate-800 p-3"
            style={{ margin: "8px" }}
            onClick={() => handleSubmit("C")}
            disabled={submitted}
          >
            Option C: {questions[currentQuestion].C}
          </Button>
          <Button
            className="slate-800 p-3"
            style={{ margin: "8px" }}
            onClick={() => handleSubmit("D")}
            disabled={submitted}
          >
            Option D: {questions[currentQuestion].D}
          </Button>
        </span>
      </div>
    </>
  );
}
