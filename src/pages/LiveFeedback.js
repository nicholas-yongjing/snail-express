import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { firestore } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { resetLectureFeedbacks, setLectureFeedback } from "../database";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import WebPage from "../components/WebPage";
import Header from "../components/Header";

export default function LiveFeedback() {
  const { currentClass, isTutor } = useClass();
  const { currentUser } = useAuth();
  const [results, setResults] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const variants = ["danger", "info", "warning", "success"];
  const reactions = useMemo(() => ["fast", "slow", "confusing", "good"], []);
  const feedbackRef = useMemo(() => collection(firestore, "classes",
    currentClass.id, "feedback"), [currentClass.id]);

  const handleSubmit = (reaction) => {
    setLoading(true);
    setLectureFeedback(currentClass.id, currentUser, reaction)
      .then(() => setLoading(false));
  };

  const handleReset = () => {
    setLoading(true);
    resetLectureFeedbacks(currentClass.id)
      .then(() => {
        setResults([0, 0, 0, 0])
      })
      .then(() => setLoading(false));
  };
 
  useEffect(() => {
    const unsubscribe = onSnapshot(feedbackRef, (snapshot) => {
      const arr = [0, 0, 0, 0];
      snapshot.docs.forEach((doc) => {
        arr[reactions.indexOf(doc.data().reaction)] += 1;
      });
      setResults(arr);
    });

    return unsubscribe;
  }, [feedbackRef, reactions]);


  const sum = (arr) => arr.reduce((x, y) => x + y, 0);

  return (
    <>
      <WebPage>
        <Container fluid='xl'>
          <Container
            className="d-flex flex-column gap-4 align-items-center mt-5 p-4 slate-600 "
            style={{ margin: "auto", maxWidth: "900px", minHeight: "350px" }}
          >
            <Header
              headerText={currentClass ? currentClass.className : ""}
              buttonText="Back to class dashboard"
              linkTo="/class-dashboard"
            />
            <DropdownButton
              title="Submit feedback"
              className="slate-800 btn-secondary"
            >
              {reactions.map((reaction) => {
                return (
                  <Dropdown.Item
                    onClick={() => handleSubmit(reaction)}
                    key={reaction}
                  >
                    {reaction}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <div>
              {!loading ? (
                reactions.map((reaction) => {
                  const percentage =
                    sum(results) === 0
                      ? 0
                      : Math.round(
                        (results[reactions.indexOf(reaction)] / sum(results)) *
                        100
                      );
                  return (
                    <div key={reaction}>
                      <ProgressBar
                        style={{
                          minHeight: "30px",
                          minWidth: "400px",
                          maxWidth: "800px",
                        }}
                        animated
                        now={percentage}
                        label={`${percentage}%`}
                        variant={variants[reactions.indexOf(reaction)]}
                      />
                      <div className="fs-5">
                        {results[reactions.indexOf(reaction)] +
                          " out of " +
                          sum(results) +
                          " find the lecture "}
                        <strong className="text-slate-200">{reaction}</strong>
                      </div>
                    </div>
                  );
                })
              ) : (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </div>
            <div className="mt-3 d-flex align-items-center">
              {isTutor() ? (
                <Button
                  className="generic-button"
                  onClick={handleReset}
                  style={{ margin: "auto", minWidth: "400px" }}
                >
                  Reset responses
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          </Container>
        </Container>

      </WebPage>
    </>
  );
};
