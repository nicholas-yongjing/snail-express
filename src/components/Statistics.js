import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { ProgressBar } from "react-bootstrap";

export default function Statistics(props) {
  const { name, currentClass, currentQuestion } = props;
  const [studentResponses, setStudentResponses] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    total: 0,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log("Using effect in statistics");
    const unsubscribe = onSnapshot(
      doc(
        firestore,
        "classes",
        currentClass.id,
        "quizzes",
        name,
        "questions",
        `${currentQuestion + 1}`
      ),
      (doc) => {
        setStudentResponses(doc.data().responses);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <div className="slate-600 p-4" style={{ margin: "16px" }}>
      <h3 className="slate-600 text-slate-200 p-4">Statistics</h3>
      <div>
        <div className="d-flex justify-content-center">{studentResponses.A} out of {studentResponses.total} selected option A</div>
        <ProgressBar
          style={{ margin: "16px", minHeight: "25px" }}
          animated
          striped
          variant="success"
          now={studentResponses.total == 0 ? 0 : (studentResponses.A / studentResponses.total) * 100}
        />
        <div className="d-flex justify-content-center">{studentResponses.B} out of {studentResponses.total} selected option B</div>
        <ProgressBar
          style={{ margin: "16px", minHeight: "25px" }}
          animated
          striped
          variant="info"
          now={studentResponses.total == 0 ? 0 : (studentResponses.B / studentResponses.total) * 100}
        />
        <div className="d-flex justify-content-center">{studentResponses.C} out of {studentResponses.total} selected option C</div>
        <ProgressBar
          style={{ margin: "16px", minHeight: "25px" }}
          animated
          striped
          variant="warning"
          now={studentResponses.total == 0 ? 0 : (studentResponses.C / studentResponses.total) * 100}
        />
        <div className="d-flex justify-content-center">{studentResponses.D} out of {studentResponses.total} selected option D</div>
        <ProgressBar
          style={{ margin: "16px", minHeight: "25px" }}
          animated
          striped
          variant="danger"
          now={studentResponses.total == 0 ? 0 : (studentResponses.D / studentResponses.total) * 100}
        />
      </div>
    </div>
  );
}
