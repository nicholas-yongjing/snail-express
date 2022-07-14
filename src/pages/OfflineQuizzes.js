import React from "react";
import SideBar from "../components/SideBar";
import WebPage from "../components/WebPage";
import { Link } from "react-router-dom";

export default function AllQuizzes(props) {
  const { quizList, sidebarLinks } = props;

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
      </div>
    </WebPage>
  );
}
