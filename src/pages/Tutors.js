import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Card } from "react-bootstrap";
import WebPage from "../components/WebPage";
import Header from "../components/Header";

const Tutors = () => {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const { getTutors } = firestore;
  const [tutorList, setTutorList] = useState([]);

  const populateTutors = useCallback(() => {
    if (currentUser && currentClass) {
      getTutors(currentClass.id)
        .then((tutors) => {
          setTutorList(tutors.map((tutor) => {
            return tutor.name;
          }));
        })
    }
  }, [currentUser, currentClass]);

  useEffect(() => {
    populateTutors();
  }, [populateTutors]);

  return (
    <>
      <WebPage>
        <div className="p-4 slate-800 d-flex flex-column align-items-center gap-2">
        <Header
          headerText="Tutors"
          buttonText="Back to class dashboard"
          linkTo="/class-dashboard"
          buttonClass="light-button"
        />
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
