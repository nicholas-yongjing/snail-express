import React, { useState } from "react";

import WebPage from "../components/WebPage";

import { useClass } from "../contexts/ClassContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { firestore } from "../firebase";
import { collection } from "firebase/firestore";
import SideBar from "../components/SideBar";

export default function QuizDashboard() {
  const { currentClass } = useClass();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);

  const quizColRef = collection(
    firestore,
    "classes",
    currentClass.id,
    "quizzes"
  );

  const isTutor = () => {
    if (currentUser && currentClass) {
      return (
        currentClass.headTutor.id === currentUser.id ||
        currentClass.tutorIds.includes(currentUser.id)
      );
    }
  };

  const sidebarLinks = [["/allquizzes", "All quizzes"]];
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
        <div>
          {isTutor ? (
            <div>Display all quizzes</div>
          ) : (
            <div>Wait for quiz to load</div>
          )}
        </div>
      </div>
    </WebPage>
  );
}
