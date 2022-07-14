import React, { useEffect, useState } from "react";

import WebPage from "../components/WebPage";
import DisplayQuiz from "./DisplayQuiz";

import { useClass } from "../contexts/ClassContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { firestore } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDocsFromCache,
  query,
  setDoc,
} from "firebase/firestore";
import SideBar from "../components/SideBar";
import { Card, Container } from "react-bootstrap";

export default function QuizDashboard() {
  const { currentClass } = useClass();
  const { currentUser } = useAuth();
  // const [loading, setLoading] = useState(false);
  const [quizRefList, setQuizRefList] = useState([]);
  const [displayQuiz, setDisplayQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState("");

  const quizColRef = collection(
    firestore,
    "classes",
    currentClass.id,
    "quizzes"
  );

  const toggleDisplayQuiz = (path) => {
    setDisplayQuiz(!displayQuiz);
    if (path === "") {
      setDoc(doc(firestore, `${activeQuiz}`, "questions", "status"), {
        active: false,
        curr: 0,
        correct: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        wrong: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      });
    } else {
      setActiveQuiz(path);
      setDoc(doc(firestore, `${path}`, "questions", "status"), {
        active: true,
        curr: 0,
        correct: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        wrong: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      });
    }
  };

  useEffect(() => {
    setDisplayQuiz(false);
    setActiveQuiz("");
    getDocs(collection(firestore, "classes", currentClass.id, "quizzes")).then(
      (s) => setQuizRefList(s.docs.map((content) => content.ref.path))
    );
  }, []);

  const isTutor = () => {
    if (currentUser && currentClass) {
      return (
        currentClass.headTutor.id === currentUser.id ||
        currentClass.tutorIds.includes(currentUser.id)
      );
    }
  };

  const sidebarLinks = [
    ["/quiz", "All quizzes"],
    ["/livequiz", "Live quiz"],
  ];
  if (isTutor) {
    sidebarLinks.push(["/createquiz", "Create quiz"]);
  }

  const populateQuizzes = () => {};

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
        <div className="d-flex p-4">
          {isTutor ? (
            <div>
              {displayQuiz ? (
                <h2 className="p-3">
                  {activeQuiz.split("/")[activeQuiz.split("/").length - 1]}
                </h2>
              ) : (
                <h2 className="p-3">View all quizzes here</h2>
              )}
              {displayQuiz ? (
                <div>
                  <Button onClick={() => toggleDisplayQuiz("")}>
                    <div>Hide quiz</div>
                  </Button>
                  <Container className="mt-3 p-4">
                    <Card className="slate-600">
                      <DisplayQuiz quiz={activeQuiz} />
                    </Card>
                  </Container>
                </div>
              ) : (
                quizRefList.map((path) => {
                  const temp = path.split("/");
                  const name = temp[temp.length - 1];
                  return (
                    <Button key={name} onClick={() => toggleDisplayQuiz(path)}>
                      {name}
                    </Button>
                  );
                })
              )}
            </div>
          ) : (
            <div>Wait for the tutor to activate quiz</div>
          )}
        </div>
      </div>
    </WebPage>
  );
}
