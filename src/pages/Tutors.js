import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { getTutors } from "../database";
import WebPage from "../components/WebPage";
import Button from "../components/Button";

const Tutors = () => {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const [tutorList, setTutorList] = useState([]);

  useEffect(() => {
    populateTutors();
  }, []);

  function populateTutors() {
    if (currentUser && currentClass) {
      getTutors(currentClass.id)
        .then((tutors) => {
          setTutorList(tutors.map((tutor) => {
            return tutor.name;
          }));
        })
    }
  }

  return (
    <>
      <WebPage>
        <div className="p-4 slate-800 d-flex flex-column align-items-center gap-2">
          <div className="align-self-stretch text-slate-200 d-flex justify-content-between">
            <h1>Tutors</h1>
            <Link to="/class-dashboard">
              <Button className="align-self-start light-button">
                Back to class dashboard
              </Button>
            </Link>
          </div>
          {currentClass ? (
            tutorList.map((name) => {
              return (
                <div key={name}>
                  <Card
                    className="slate-700 text-slate-200 d-flex align-items-center"
                    key={name}
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  >
                    <Card.Body>{name}</Card.Body>
                  </Card>
                </div>
              );
            })
          ) : (
            <div>No tutors</div>
          )}
        </div>
      </WebPage>
    </>
  );
};

export default Tutors;
