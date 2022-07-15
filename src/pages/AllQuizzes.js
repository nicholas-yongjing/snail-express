import React, { useState } from "react";
import Quiz from "../components/Quiz";
import Button from "../components/Button";

export default function AllQuizzes(props) {
  const { quizList } = props;
  const [showQuiz, setShowQuiz] = useState(false);

  const toggleQuiz = () => {
    setShowQuiz(!showQuiz);
  };

  return (
    <div className="p-4">
      {quizList.map((obj, index) => {
        const name = obj.id;
        const questions = obj.data.forEach((doc) => doc.data());
        return showQuiz ? (
          <div key={index}>
            <Quiz name={name} questions={questions} />
            <Button className="mt-3" onClick={toggleQuiz}>
              Hide quiz
            </Button>
          </div>
        ) : (
          <div key={index}>
            <h3>View all quizzes</h3>
            <Button className="mt-3" onClick={toggleQuiz}>
              {name}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
