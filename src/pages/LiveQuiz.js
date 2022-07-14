import React, { useEffect, useState, useMemo } from "react";
import { firestore } from "../firebase";
import { useClass } from "../contexts/ClassContext";
import {
  getDoc,
  doc,
  collection,
  query,
  getDocs,
  orderBy,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import Button from "../components/Button";

export default function LiveQuiz(props) {
  const { currentClass, isTutor } = useClass();
  const quizRef = useMemo(() => props.quiz, [props]);
  const [questionList, setQuestionList] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [active, setActive] = useState(false);

  const letters = ["A", "B", "C", "D"];

  useEffect(() => {
    const q = query(collection(firestore, quizRef), orderBy("id"));
    const populateQuestions = async () => {
      const data = await getDocs(q).then((s) => {
        setQuestionList(s.docs.map((x) => x.data()));
      });
    };
    populateQuestions();
  }, []);

  const handleStartQuiz = () => {
    setActive(true);
    getDoc(doc(firestore, quizRef, "status")).then((doc) => {
      setIndex(doc.data().curr);
    });
    setQuestion(questionList[index].qn);
    setOptions([
      questionList[index].A,
      questionList[index].B,
      questionList[index].C,
      questionList[index].D,
    ]);
    setAnswer(questionList[index].ans);
  };

  const handleUpdateStatistics = (response) => {
    setDisabled(true);
    let obj = {}
    getDoc(doc(firestore, quizRef, "status")).then(doc => {
        obj = doc;
    });
    console.log(obj);
    if (response == answer) {
    //   temp.correct[index] += 1;
    //   setDoc(doc(firestore, quizRef, "status"), temp);
    } else {
    //   temp.wrong[index] += 1;
    //   setDoc(doc(firestore, quizRef, "status"), temp);
    }
  };

  useEffect(() => {
    console.log("using effect");
    const unsubscribe = onSnapshot(doc(firestore, quizRef, "status"), (doc) => {
      console.log("inside snapshot");
      if (questionList.length > 0) {
        setDisabled(false);
        setLoading(true);
        setIndex(doc.data().curr);
        setQuestion(questionList[index].qn);
        setOptions([
          questionList[index].A,
          questionList[index].B,
          questionList[index].C,
          questionList[index].D,
        ]);
        setAnswer(questionList[index].ans);
        setTimeout(() => setLoading(false), 2000);
      }
    });
    return unsubscribe;
  }, [quizRef]);

  return (
    <>
      <div>
        <div className="slate-600 p-4" style={{ minWidth: "" }}>
          <h3 className="p-3">Question {index + 1}</h3>
          <h4 className="slate-800 p-4" style={{ margin: "12px" }}>
            {question}
          </h4>
          <span>
            {options.slice(0, 2).map((option, id) => {
              return (
                <Button
                  style={{ margin: "12px" }}
                  key={option}
                  disabled={disabled}
                  onClick={() => handleUpdateStatistics(letters[id])}
                >
                  <div>Option {" " + letters[id] + ":"}</div>
                  <div>{option}</div>
                </Button>
              );
            })}
          </span>
          <span>
            {options.slice(2).map((option, id) => {
              return (
                <Button
                  style={{ margin: "12px" }}
                  key={option}
                  disabled={disabled}
                  onClick={() => handleUpdateStatistics(letters[id + 2])}
                >
                  <div>Option {" " + letters[id + 2] + ":"}</div>
                  <div>{option}</div>
                </Button>
              );
            })}
          </span>
          <br></br>
        </div>
      </div>
    </>
  );
}
