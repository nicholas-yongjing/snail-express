import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { query, collection, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { useClass } from "../contexts/ClassContext";
import RevisionQuiz from "../components/RevisionQuiz";

export default function OfflineQuizzes() {
  const { currentClass } = useClass();
  const [quizList, setQuizList] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const [currentQuiz, setCurrentQuiz] = useState({});

  const toggleQuiz = (quiz) => {
    setShowQuiz(!showQuiz);
    setCurrentQuiz(quiz == null ? {} : quiz);
  };

  useEffect(() => {
    const q = query(
      collection(firestore, "classes", currentClass.id, "quizzes"),
      where("offline", "==", true)
    );
    
    getDocs(q).then(async (snapshot) => {
      return Promise.all(
        snapshot.docs.map(async (document) => {
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
  }, []);

  return (
    <div className="p-4">
      <div>
        {showQuiz ? (
          <div>
            <RevisionQuiz currentQuiz={currentQuiz} />
            <div
              key={currentQuiz.name}
              className="d-flex flex-column align-items-start"
            >
              <Button className="mt-3" onClick={toggleQuiz}>
                Hide quiz
              </Button>
            </div>
          </div>
        ) : (
          <h3>View all quizzes</h3>
        )}
      </div>
      {quizList.map((quiz, index) => {
        const name = quiz.id;
        return (
          <div key={index}>
            <Button
              className="mt-3"
              onClick={() => toggleQuiz(quiz)}
              hidden={showQuiz}
            >
              {name}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
