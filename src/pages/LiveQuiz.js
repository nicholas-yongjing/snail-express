import React, { useEffect, useState } from "react";
import WebPage from "../components/WebPage";
import Button from "../components/Button";
import SideBar from "../components/SideBar";
import LiveQuizContainer from "../components/LiveQuizContainer";

import { useClass } from "../contexts/ClassContext";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

export default function LiveQuiz() {
  const { currentClass } = useClass();
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [found, setFound] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const sidebarLinks = [
    ["/quiz-dashboard", "Offline quizzes"],
    ["/live-quiz", "Live quiz"],
  ];

  const handleSearch = () => {
    getDoc(doc(firestore, "classes", currentClass.id, "quizzes", "live")).then(
      (doc) => {
        if (doc.data().name != "") {
          setFound(true);
        } else {
          return;
        }
        setName(doc.data().name);
      }
    );
  };

  const handleSubmit = () => {};

  const handleShowQuiz = () => {
    if (name != "") {
      getDocs(
        collection(
          firestore,
          "classes",
          currentClass.id,
          "quizzes",
          name,
          "questions"
        )
      )
        .then((questions) =>
          setQuestions(questions.docs.map((doc) => doc.data()))
        )
        .then(() => setShowQuiz(true));

      getDoc(
        doc(
          firestore,
          "classes",
          currentClass.id,
          "quizzes",
          name,
          "questions",
          "0"
        )
      ).then((doc) => {
        console.log(doc);
        // setCurrentQuestion(doc.data().currentQuestion);
        setTimeout(() => {}, 3000);
      });
    }
  };

  return (
    <WebPage>
      <div className="flex-grow-1 justify-self-stretch d-flex text-slate-200 fs-5">
        <SideBar>
          {sidebarLinks.map(([link, text]) => {
            return (
              <Link
                to={link}
                key={text}
                className="btn fs-4 w-100 generic-button d-flex justify-content-center"
              >
                {text}
              </Link>
            );
          })}
        </SideBar>
        <div>
          <span className="d-flex align-items-center p-4">
            <h3 className="mt-1">Live Quiz</h3>
            {found && (
              <div style={{ marginLeft: "16px" }}>
                Successful search. Quiz found!
              </div>
            )}
          </span>
          <div>
            <Button
              style={{ margin: "8px" }}
              onClick={handleSearch}
              disabled={found}
            >
              Search for an active live quiz
            </Button>
            <Button onClick={handleShowQuiz}>{name}</Button>
          </div>

          {found && showQuiz && (
            <LiveQuizContainer
              name={name}
              questions={questions}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            />
          )}
        </div>
      </div>
    </WebPage>
  );
}
