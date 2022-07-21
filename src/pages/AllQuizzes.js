import React, { useEffect, useState } from "react";
import TutorQuizInterface from "../components/TutorQuizInterface";
import Button from "../components/Button";
import { Spinner } from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";

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
    resetQuiz(currentClass);
  }, []);

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
