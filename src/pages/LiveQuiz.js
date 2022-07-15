import React from "react";
import WebPage from "../components/WebPage";

export default function LiveQuiz() {
  return (
    <WebPage>
      <h3>LIVE QUIZ</h3>
      <div></div>
      <span>
        <Button
          className="slate-800 p-3"
          style={{ margin: "8px" }}
          onClick={() => handleSubmit("A")}
          disabled={submitted}
        >
          Option A: {questions[currentQuestion].A}
        </Button>
        <Button
          className="slate-800 p-3"
          style={{ margin: "8px" }}
          onClick={() => handleSubmit("B")}
          disabled={submitted}
        >
          Option B: {questions[currentQuestion].B}
        </Button>
        <Button
          className="slate-800 p-3"
          style={{ margin: "8px" }}
          onClick={() => handleSubmit("C")}
          disabled={submitted}
        >
          Option C: {questions[currentQuestion].C}
        </Button>
        <Button
          className="slate-800 p-3"
          style={{ margin: "8px" }}
          onClick={() => handleSubmit("D")}
          disabled={submitted}
        >
          Option D: {questions[currentQuestion].D}
        </Button>
      </span>
    </WebPage>
  );
}
