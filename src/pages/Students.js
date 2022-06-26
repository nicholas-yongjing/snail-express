import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";
import { getStudents } from "../database";
import WebPage from "../components/WebPage";
import Button from "../components/Button";

const Students = () => {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    populateStudents();
  }, []);

  function populateStudents() {
    if (currentUser && currentClass) {
      getStudents(currentClass.id)
        .then((students) => {
          setStudentList(students.map((student) => {
            return student.name;
          }));
        })
    }
  }

  return (
    <WebPage>
      <div className="p-4 slate-800 d-flex flex-column align-items-center gap-2">
        <div className="align-self-stretch text-slate-200 d-flex justify-content-between">
          <h1>Students</h1>
            <Link to="/class-dashboard">
              <Button className="align-self-start light-button">
                Back to class dashboard
              </Button>
            </Link>
        </div>
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
