import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getClasses } from "../database";
import { Container } from "react-bootstrap";

import NavigationBar from "../components/NavigationBar";
import Classes from "../components/Classes";
import Invites from "../components/Invites";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [createdClasses, setCreatedClasses] = useState([]);
  const [teachingClasses, setTeachingClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  useEffect(() => {
    populateClasses('head tutor', setCreatedClasses);
    populateClasses('tutor', setTeachingClasses);
    populateClasses('student', setEnrolledClasses);
  }, [currentUser]);

  function populateClasses(role, setter) {
    if (currentUser.email) {
      getClasses(currentUser.uid, role).then((classes) => {
        if (classes) {
          setter(classes);
        }
      })
    }
  }

  return (
    <>
      <NavigationBar />
      <Container className="m-5 d-flex flex-column gap-4">
        <h1 className="fs-2">
          Welcome back, <strong>{currentUser.email}</strong>!
        </h1>
        <div className='d-flex gap-3 justify-content-between'>
          <h1><strong>My Classes</strong></h1>
          <Link to="/add-class">
            <button type="button" className="btn btn-primary">
              Add Class
            </button>
          </Link>
        </div>
        <Classes classType={"Created"} classes={createdClasses} />
        <Classes classType={"Teaching"} classes={teachingClasses} />
        <Classes classType={"Enrolled"} classes={enrolledClasses} />
        <h1><strong>Pending Invitations</strong></h1>
        <Invites
          role='tutor'
          populateClasses={() => populateClasses('tutor', setTeachingClasses)}
        />
        <Invites
          role='student'
          populateClasses={() => populateClasses('student', setEnrolledClasses)}
        />
      </Container>
    </>
  );
}
