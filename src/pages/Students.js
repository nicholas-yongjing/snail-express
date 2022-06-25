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
    console.log("Using effect");
    getDocs(studentsRef).then((snapshot) => {
        setStudentList(snapshot.docs.map((doc) => {
        return doc.data().email;
      }));
    });
  }, []);

  return (
    <>
      <div>nav bar</div>
      <br></br>
      <div>
        {studentList.map((email) => {
          return <span key={email}>{email}</span>;
        })}
      </div>
    </>
  );
};

export default Students;
