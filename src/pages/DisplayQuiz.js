import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { getDocs, doc, collection, query, orderBy } from "firebase/firestore";
import Button from "../components/Button";
import { Alert, Spinner, Card } from "react-bootstrap";

export default function DisplayQuiz(props) {
  const quizRef = props.quiz + "/questions";
  const [questionList, setQuestionList] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const letters = ["A", "B", "C", "D"];
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, quizRef), orderBy("id"));
    getDocs(q).then((s) => {
      setQuestionList(s.docs.map((x) => x.data()));
    });
  }, []);

  const handleStartQuiz = () => {
    setQuestion(questionList[index].qn);
    setOptions([
      questionList[index].A,
      questionList[index].B,
      questionList[index].C,
      questionList[index].D,
    ]);
    setAnswer(questionList[index].ans);
    setLoading(false);
  };

  const handlePreviousQuestion = () => {
    setDisabled(false);
    const prev = Math.max(index - 1, 0);
    setQuestion(questionList[prev].qn);
    setOptions([
      questionList[prev].A,
      questionList[prev].B,
      questionList[prev].C,
      questionList[prev].D,
    ]);
    setAnswer(questionList[prev].ans);
    setIndex(prev);
  };

  const handleNextQuestion = () => {
    setDisabled(false);
    const next = Math.min(index + 1, questionList.length);
    if (next == questionList.length) {
      setCompleted(true);
      return;
    }
    setQuestion(questionList[next].qn);
    setOptions([
      questionList[next].A,
      questionList[next].B,
      questionList[next].C,
      questionList[next].D,
    ]);
    setAnswer(questionList[next].ans);
    setIndex(next);
  };

  const handleUpdateScore = (option) => {
    setDisabled(true);
    if (option == answer) {
      setScore(score + 1);
    } else {
      setIncorrectQuestions([
        ...incorrectQuestions,
        { ...questionList[index], attempt: `${option}` },
      ]);
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <Button onClick={handleStartQuiz}>
            Click here to start the quiz
          </Button>
        </div>
      ) : completed ? (
        <div className="p-3">
          <div>
            <Alert
              variant={score <= questionList.length / 2 ? "danger" : "success"}
            >
              Quiz completed{score <= questionList.length / 2 ? "." : "!"} Your
              score is: {score + "/" + questionList.length}
            </Alert>
          </div>
          <div>

            {incorrectQuestions.length == 0 ? (
              <div>Good job</div>
            ) : <div>
              <div>Incorrect questions: </div>
              {incorrectQuestions.map((question, idx) => {
                return (
                  <div key={idx} className="p-3">
                    <span className="d-flex">
                      <h3>Question {question.id + 1 + ": "}</h3>
                      <h3>&nbsp;{question.qn}</h3>
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
                        {question.ans}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>}
          </div>
        </div>
      ) : (
        <div className="slate-600 p-4" style={{ minWidth: "" }}>
          <h3 className="p-3">Question {index + 1}</h3>
          <h4 className="slate-800 p-4" style={{ margin: "12px" }}>
            {question}
          </h4>
          <span>
            {options.slice(0, 2).map((option, id) => {
              return (
                <Button
                  style={{ margin: "12px" }}
                  key={option}
                  disabled={disabled}
                  onClick={() => handleUpdateScore(letters[id])}
                >
                  <div>Option {" " + letters[id] + ":"}</div>
                  <div>{option}</div>
                </Button>
              );
            })}
          </span>
          <span>
            {options.slice(2).map((option, id) => {
              return (
                <Button
                  style={{ margin: "12px" }}
                  key={option}
                  disabled={disabled}
                  onClick={() => handleUpdateScore(letters[id + 2])}
                >
                  <div>Option {" " + letters[id + 2] + ":"}</div>
                  <div>{option}</div>
                </Button>
              );
            })}
          </span>
          <br></br>
          <span className="d-flex justify-content-between">
            <Button onClick={handlePreviousQuestion} style={{ margin: "12px" }}>
              Previous
            </Button>
            <Button onClick={handleNextQuestion} style={{ margin: "12px" }}>
              Show next
            </Button>
          </span>
        </div>
      )}
    </div>
  );
}
