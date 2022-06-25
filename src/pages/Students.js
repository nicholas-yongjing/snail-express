import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { Card } from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";
import { firestore } from "../firebase";
import WebPage from "../components/WebPage";

const Students = () => {
  const { currentClass } = useClass();
  const [studentList, setStudentList] = useState([]);

  const studentsRef = collection(
    firestore,
    "classes",
    currentClass.id,
    "students"
  );

  useEffect(() => {
    getDocs(studentsRef).then((snapshot) => {
      setStudentList(
        snapshot.docs.map((doc) => {
          return doc.data().name;
        })
      );
    });
  }, [studentsRef]);

  return (
    <>
      <WebPage>
        <br></br>
        <div>
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
    </>
  );
};

export default Students;
