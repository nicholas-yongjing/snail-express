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

  const populateQuizList = async () => {
    // console.log("Populating quiz list");
    return await getDocs(
      collection(firestore, "classes", currentClass.id, "quizzes")
    ).then(async (snapshot) => {
    //   console.log(snapshot.docs);

      return Promise.all(
        snapshot.docs.map(async (document) => {
        //   console.log(document);
          return await getDocs(
            collection(
              firestore,
              "classes",
              currentClass.id,
              "quizzes",
              document.id,
              "questions"
            )
          );
        })
      ).then(async (promises) => {
        return setQuizList(
          promises.map((questions) => {
            return {
              id: questions.query._path.segments[3], // get quiz name from path
              data: questions.docs,
            };
          })
        );
      });
    });
  };

  useEffect(() => {
    populateQuizList();
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
