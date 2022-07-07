import React from "react";
import { Card, Container } from "react-bootstrap";
import WebPage from "./WebPage";
import Question from "./Question";

export default function CreateQuiz() {
  return (
    <WebPage>
      <Container className="mt-3">
        <Card className="slate-600 text-slate-200 fs-4">
          <Question />
        </Card>
      </Container>
    </WebPage>
  );
}
