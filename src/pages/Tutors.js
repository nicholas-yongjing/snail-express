import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { Card } from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";
import NavigationBar from "../components/NavigationBar";
import { firestore } from "../firebase";

const Tutors = () => {
  const { currentClass } = useClass();
  const [tutorList, setTutorList] = useState([]);

  const tutorsRef = collection(
    firestore,
    "classes",
    currentClass.id,
    "tutors"
  );

  useEffect(() => {
    getDocs(tutorsRef).then((snapshot) => {
      setTutorList(
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
        {tutorList.map((name) => {
          return (
            <span key={name}>
              <Card key={name} style={{ maxWidth: "300px", maxHeight: "300px" }}>
                <Card.Body>{name}</Card.Body>
              </Card>
            </span>
          );
        })}
      </div>
    </>
  );
};

export default Tutors;
