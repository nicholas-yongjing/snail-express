import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Card } from "react-bootstrap";
import WebPage from "../components/WebPage";
import Header from "../components/Header";

const Students = () => {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const { getStudents } = firestore;
  const [studentList, setStudentList] = useState([]);

  const populateStudents = useCallback(() => {
    if (currentUser && currentClass) {
      getStudents(currentClass.id)
        .then((students) => {
          setStudentList(students.map((student) => {
            return student.name;
          }));
        })
    }
  }, [currentUser, currentClass]);

  useEffect(() => {
    populateStudents();
  }, [populateStudents]);

  return (
    <WebPage>
      <div className="p-4 slate-800 d-flex flex-column align-items-center gap-2">
        <Header
          headerText="Students"
          buttonText="Back to class dashboard"
          linkTo="/class-dashboard"
          buttonClass="light-button"
        />
        {currentClass ? (
          studentList.map((email) => {
            return (
              <div key={email}>
                <Card
                  className="slate-700 text-slate-200 d-flex align-items-center"
                  key={email}
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                >
                  <Card.Body>{email}</Card.Body>
                </Card>
              </div>
            );
          })
        ) : (
          <div>No students</div>
        )}
      </div>
    </WebPage>
  );
};

export default Students;
