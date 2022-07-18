import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Alert } from "react-bootstrap";

export default function RevisionQuiz(props) {
  const { currentQuiz } = props;
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  useEffect(() => {
    setQuestions(currentQuiz.data.map((doc) => doc.data()));
  }, []);

  const toggleQuiz = () => {
    setShowQuiz(!showQuiz);
  };

  const handleUpdateScore = (response) => {
    if (response == questions[currentQuestion].answer) {
      setScore(score + 1);
    } else {
      setIncorrectQuestions([
        ...incorrectQuestions,
        { ...questions[currentQuestion], attempt: `${response}` },
      ]);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  return (
    <div>
      {showQuiz && currentQuestion < questions.length ? (
        <div>
          <h3>{currentQuiz.id}</h3>
          <div className="slate-600">
            <h3 className="p-4">Question {currentQuestion + 1}</h3>
            <div className="slate-800 p-4" style={{ margin: "12px" }}>
              {questions[currentQuestion].question}
            </div>
            <span className="d-flex justify-content-between">
              <Button
                className="p-4"
                style={{ margin: "12px" }}
                onClick={() => handleUpdateScore("A")}
              >
                Option A: {questions[currentQuestion].A}
              </Button>
              <Button
                className="p-4"
                style={{ margin: "12px" }}
                onClick={() => handleUpdateScore("B")}
              >
                Option B: {questions[currentQuestion].B}
              </Button>
              <Button
                className="p-4"
                style={{ margin: "12px" }}
                onClick={() => handleUpdateScore("C")}
              >
                Option C: {questions[currentQuestion].C}
              </Button>
              <Button
                className="p-4"
                style={{ margin: "12px" }}
                onClick={() => handleUpdateScore("D")}
              >
                Option D: {questions[currentQuestion].D}
              </Button>
            </span>
            <br></br>
          </div>
        </div>
      ) : (
        <Button onClick={toggleQuiz} hidden={currentQuestion >= questions.length}>Start Quiz</Button>
      )}
      {currentQuestion >= questions.length && (
        <div>
          <div className="p-3">
            <div>
              <Alert
                variant={score <= questions.length / 2 ? "danger" : "success"}
              >
                Quiz completed{score <= questions.length / 2 ? "." : "!"} Your
                score is: {score + "/" + questions.length}
              </Alert>
            </div>
            <div className="slate-600 p-3">
              {incorrectQuestions.length == 0 ? (
                <div>Good job</div>
              ) : (
                <div>
                  <h3>Incorrect questions: </h3>
                  {incorrectQuestions.map((question, index) => {
                    return (
                      <div
                        key={index}
                        className="p-3 slate-800"
                        style={{ margin: "16px" }}
                      >
                        <span className="d-flex">
                          <h4>Question {question.id + 1 + ": "}</h4>
                          <h4>&nbsp;{question.question}</h4>
                        </span>
                        <div>
                          <div>
                            <strong>A: </strong>
                            {question.A + " "}
                          </div>
                          <div>
                            <strong>B: </strong>
                            {question.B + " "}
                          </div>
                          <div>
                            <strong>C: </strong>
                            {question.C + " "}
                          </div>
                          <div>
                            <strong>D: </strong>
                            {question.D + " "}
                          </div>
                          <br></br>
                          <div>
                            <strong>You selected: </strong>
                            {question.attempt}
                          </div>
                          <div>
                            <strong>Correct answer: </strong>
                            {question.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
