import React, { useEffect, useState } from "react";
import AllQuizzes from "./AllQuizzes";
import RevisionQuizzes from "./RevisionQuizzes";
import SideBar from "../components/SideBar";
import WebPage from "../components/WebPage";

import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Link } from "react-router-dom";

export default function QuizDashboard() {
  const { currentClass, isTutor } = useClass();
  const { pullQuizList } = firestore;
  const [quizList, setQuizList] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const tutor = isTutor();

  const sidebarLinks = tutor
    ? [
        ["/quiz-dashboard", "All quizzes"],
        ["/create-quiz", "Create Quiz"],
      ]
    : [
        ["/quiz-dashboard", "Revision quizzes"],
        ["/live-quiz", "Live quiz"],
      ];

  useEffect(() => {
    pullQuizList(currentClass.id, setQuizList);
  }, [currentClass.id, pullQuizList, showQuiz]);

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
          {tutor ? (
            <div className="d-flex flex-grow-1">
              <AllQuizzes
                showQuiz={showQuiz}
                setShowQuiz={setShowQuiz}
                quizList={quizList}
              />
            </div>
          ) : (
            <div>
              <RevisionQuizzes quizList={quizList} />
            </div>
          )}
        </div>
      </WebPage>
    </>
  );
}
