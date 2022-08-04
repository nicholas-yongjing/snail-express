import React, { useEffect, useState } from "react";
import TutorQuizInterface from "../components/TutorQuizInterface";
import Button from "../components/Button";
import { Spinner } from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Link } from "react-router-dom";

export default function AllQuizzes(props) {
  const { showQuiz, setShowQuiz, quizList } = props;
  const [currentQuiz, setCurrentQuiz] = useState({});
  const { currentClass } = useClass();
  const { resetQuiz } = firestore;

  const toggleQuiz = (quiz) => {
    setShowQuiz(!showQuiz);
    setCurrentQuiz(quiz == null ? {} : quiz);
  };

  useEffect(() => {
    resetQuiz(currentClass.id);
  }, [currentClass.id, resetQuiz]);

  return (
    <div className="p-4">
      {showQuiz ? (
        <div>
          <TutorQuizInterface
            setShowQuiz={setShowQuiz}
            currentQuiz={currentQuiz}
          />
          <div
            key={currentQuiz.name}
            className="d-flex flex-column align-items-start"
          >
            <Button className="mt-3" onClick={toggleQuiz}>
              Hide quiz
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Link to="/class-dashboard">
            <Button className="light-button">
              <div>Back to class dashboard</div>
            </Button>
          </Link>
          <h1 className="mt-4">View all quizzes</h1>
        </div>
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
