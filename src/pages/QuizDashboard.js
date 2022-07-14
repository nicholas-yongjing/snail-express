import React, { useEffect, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import WebPage from "../components/WebPage";
import { collection } from "firebase/firestore";
import { firestore } from "../firebase";

export default function QuizDashboard() {
  const { currentClass, isTutor } = useClass();
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    getDocs(collection(firestore, "classes", currentClass.id, "quizzes")).then(
      (docs) => {
        setQuizList(docs.data()); // Populate quiz list
      }
    );
  });

  return isTutor ? <StudentQuizPage /> : <TutorQuizPage />;
}
