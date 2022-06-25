import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { Card } from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";
import NavigationBar from "../components/NavigationBar";
import { firestore } from "../firebase";

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
  }, []);

  return (
    <>
      <NavigationBar />
      <br></br>
      <div>
        {console.log(studentList)}
        {studentList.map((email) => {
          return (
            <span key={email}>
              <Card key={email} style={{ maxWidth: "300px", maxHeight: "300px" }}>
                <Card.Body>{email}</Card.Body>
              </Card>
            </span>
          );
        })}
      </div>
    </>
  );
};

export default Students;
