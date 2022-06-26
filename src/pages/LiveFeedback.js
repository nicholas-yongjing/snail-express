import {
  Button,
  Card,
  Dropdown,
  DropdownButton,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { firestore } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import {
  collection,
  deleteDoc,
  getDocs,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import WebPage from "../components/WebPage";

const LiveFeedback = () => {
  const { currentClass, isTutor } = useClass();
  const { currentUser } = useAuth();
  const [results, setResults] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(false);

  const reactions = ["fast", "slow", "confusing", "good"];
  const variants = ["danger", "info", "warning", "success"];
  const feedbackRef = collection(
    firestore,
    "classes",
    currentClass.id,
    "feedback"
  );

  const handleSubmit = (event, reaction) => {
    setLoading(true);
    setDoc(doc(feedbackRef, currentUser.uid), {
      reaction: reaction,
      user: currentUser.displayName,
    }).then(() => setLoading(false));
  };

  const handleReset = () => {
    setLoading(true);
    getDocs(feedbackRef)
      .then((snapshot) => {
        snapshot.docs.forEach((docu) => {
          const docRef = doc(feedbackRef, docu.id);
          deleteDoc(docRef).then(() => console.log("Deleted " + docu.id));
        });
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

    return () => unsubscribe();
  }, []); 
  

  const sum = (arr) => arr.reduce((x, y) => x + y, 0);

  return (
    <>
      <WebPage>
        <div className="slate-800">
  <Card
          className="d-flex align-items-center mt-5 p-4 slate-600 text-slate-200"
          style={{ margin: "auto", maxWidth: "900px", minHeight: "350px" }}
        >
          <DropdownButton
            title="Submit feedback"
            className="slate-800 btn-secondary"
          >
            {reactions.map((reaction) => {
              return (
                <Dropdown.Item
                  onClick={(event) => handleSubmit(event, reaction)}
                  key={reaction}
                >
                  {reaction}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
          <br></br>
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
        </Card>
        <br></br>
       </div>
       </WebPage>
    </>
  );
};

export default LiveFeedback;
