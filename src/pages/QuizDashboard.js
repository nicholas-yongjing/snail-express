import React, { useEffect, useState } from "react";
import AllQuizzes from "./AllQuizzes";
import OfflineQuizzes from "./OfflineQuizzes";
import SideBar from "../components/SideBar";
import WebPage from "../components/WebPage";

import { useClass } from "../contexts/ClassContext";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";

export default function QuizDashboard() {
  const { currentClass, isTutor } = useClass();
  const [quizList, setQuizList] = useState([]);
  const sidebarLinks = isTutor
    ? [
        ["/quiz-dashboard", "All quizzes"],
        ["/create-quiz", "Create Quiz"],
      ]
    : [
        ["/quiz-dashboard", "Offline quizzes"],
        ["/live-quiz", "Live quiz"],
      ];

  useEffect(() => {
    console.log("Populating quiz list");
    getDocs(collection(firestore, "classes", currentClass.id, "quizzes")).then(
      (snapshot) => {
        snapshot.docs.map((document) => {
          getDocs(
            collection(
              firestore,
              "classes",
              currentClass.id,
              "quizzes",
              document.id,
              "questions"
            )
          ).then((questions) => {
            setQuizList([
              ...quizList,
              { id: document.id, data: questions.docs },
            ]);
          });
        });
      }
    );
    setTimeout(() => {}, 2000);
  }, []);

  return (
    <>
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
          {isTutor ? (
            <AllQuizzes quizList={quizList} />
          ) : (
            <OfflineQuizzes quizList={quizList} />
          )}
        </div>
      </WebPage>
    </>
  );
}
