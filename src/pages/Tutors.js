import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { Card } from "react-bootstrap";
import { useClass } from "../contexts/ClassContext";
import NavigationBar from "../components/NavigationBar";
import { firestore } from "../firebase";
import WebPage from "../components/WebPage";

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
      <WebPage>
      <br></br>
      <div>
        {currentClass ? tutorList.map((name) => {
          return (
            <div key={name}>
              <Card className="slate-700 text-slate-200 d-flex align-items-center" key={name} style={{ maxWidth: "300px", maxHeight: "300px" }}>
                <Card.Body>{name}</Card.Body>
              </Card>
            </div>
          );
        }) : <div>No tutors</div>}
      </div>
      </WebPage>
    </>
  );
};

export default Tutors;
