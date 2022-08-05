import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import firestore from "../firestore";
import { useClass } from "../contexts/ClassContext";
import RevisionQuiz from "../components/RevisionQuiz";

export default function RevisionQuizzes() {
  const { currentClass } = useClass();
  const { pullRevisionQuizList } = firestore;
  const [quizList, setQuizList] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const [currentQuiz, setCurrentQuiz] = useState({});

  const toggleQuiz = (quiz) => {
    setShowQuiz(!showQuiz);
    setCurrentQuiz(quiz == null ? {} : quiz);
  };

  useEffect(() => {
    pullRevisionQuizList(currentClass.id, setQuizList)
  }, [currentClass.id, pullRevisionQuizList]);

  return (
    <div className="p-4">
      <div>
        {showQuiz ? (
          <div>
            <RevisionQuiz currentQuiz={currentQuiz} />
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
      </div>
      {quizList.map((quiz, index) => {
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
      })}
    </div>
  );
}
