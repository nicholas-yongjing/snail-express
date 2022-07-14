import React, { useEffect, useState } from "react";
import AllQuizzes from "./AllQuizzes";
import OfflineQuizzes from "./OfflineQuizzes";

import { useClass } from "../contexts/ClassContext";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

export default function QuizDashboard() {
  const { currentClass, isTutor } = useClass();
  const [quizList, setQuizList] = useState([]);
  const sidebarLinks = isTutor
    ? [
        ["/all-quizzes", "All quizzes"],
        ["/create-quiz", "Create Quiz"],
      ]
    : [
        ["/offline-quizzes", "Offline quizzes"],
        ["/live-quiz", "Live quiz"],
      ];

  useEffect(() => {
    console.log("Populating quiz list");
    getDocs(collection(firestore, "classes", currentClass.id, "quizzes")).then(
      (snapshot) => {
        setQuizList(snapshot.docs); // Populate quiz list
      }
    );
  }, []);

  if (isTutor) {
    return <AllQuizzes quizList={quizList} sidebarLinks={sidebarLinks} />; 
  } else {
    return <OfflineQuizzes quizList={quizList} sidebarLinks={sidebarLinks} />;
  }
}
