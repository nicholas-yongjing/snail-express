import React, { useEffect, useState } from "react";
import WebPage from "../components/WebPage";
import Button from "../components/Button";
import SideBar from "../components/SideBar";

import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function LiveQuiz() {
  const { currentClass } = useClass();
  const [name, setName] = useState("");
  const { submitAnswer } = firestore;
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const sidebarLinks = [
    ["/quiz-dashboard", "Offline quizzes"],
    ["/live-quiz", "Live quiz"],
  ];

  useEffect(() => {
    console.log("inside use effect live quiz");
    const q = query(
      collection(db, "classes", currentClass.id, "quizzes"),
      where("live", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.map((d) => {
        setCurrentQuestion(d.data().currentQuestion);
        const q = query(
          collection(db, d.ref.path, "questions"),
          orderBy("id")
        );
        getDocs(q).then((questions) => {
          setSubmitted(false);
          setQuestions(questions.docs.map((doc) => doc.data()));
          const hoops = d.ref.path.split("/");
          setName(hoops[hoops.length - 1]);
        });
      });
    });
    return unsubscribe;
  }, []);

  const handleSubmit = (response) => {
    setSubmitted(true);
    submitAnswer(currentClass.id, name, currentQuestion, response);
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
          <div className="d-flex p-4 flex-column">
            <h3>Live Quiz</h3>
            <br></br>
            <h3>{name}</h3>
            {name ? (
              <div className="slate-600 p-4 m-4 rounded">
                <div>
                  <h3 className="p-3" style={{ margin: "8px" }}>
                    Question {currentQuestion + 1}
                  </h3>
                  <h4 className="slate-800 p-4 rounded" style={{ margin: "8px" }}>
                    {questions[currentQuestion].question}
                  </h4>
                </div>
                <span className="d-flex justify-content-between" style={{marginBottom: "16px"}}>
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
                    style={{ margin: "8px"}}
                    onClick={() => handleSubmit("D")}
                    disabled={submitted}
                  >
                    Option D: {questions[currentQuestion].D}
                  </Button>
                </span>
              </div>
            ) : (
              <h4>
                No quiz available... please wait for your tutor to start a
                quiz!
              </h4>
            )}
          </div>
        </div>
      </div>
    </WebPage>
  );
}
