import React, { useEffect, useState } from "react";
import Quiz from "../components/TutorQuizInterface";
import Button from "../components/Button";
import { Spinner } from "react-bootstrap";
import { doc, getDocs, updateDoc, collection } from "firebase/firestore";
import { useClass } from "../contexts/ClassContext";
import { firestore } from "../firebase";

export default function AllQuizzes(props) {
  const { quizList } = props;
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState({});

  const toggleQuiz = (quiz) => {
    setShowQuiz(!showQuiz);
    setCurrentQuiz(quiz == null ? {} : quiz);
  };

  return (
    <div className="p-4">
      {showQuiz ? (
        <div>
          <Quiz currentQuiz={currentQuiz} />
          <div key={currentQuiz.name} className="d-flex flex-column align-items-start">
            <Button className="mt-3" onClick={toggleQuiz}>
              Hide quiz
            </Button>
          </div>
        </div>
      ) : (
        <h3>View all quizzes</h3>
      )}
      {quizList.length > 0 ? (
        quizList.map((quiz, index) => {
          const name = quiz.id;
          return (
            <div key={index}>
              <Button
                className="mt-3"
                onClick={() => toggleQuiz(quiz)}
                hidden={showQuiz}
              >
                {name}
              </Button>
            </div>
          );
        })
      ) : (
        <Spinner variant="primary" />
      )}
    </div>
  );
}
