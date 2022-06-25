import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getClasses } from "../database";
import WebPage from "../components/WebPage";
import Classes from "../components/Classes";
import Invites from "../components/Invites";
import { Container } from "react-bootstrap";

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
    <WebPage>
      <div className='slate-800 d-flex justify-content-center'>
        <Container className="m-5 d-flex flex-column gap-4 text-slate-200">
          <h1 className="fs-2">
            Welcome back, <strong>{currentUser.displayName}</strong>!
          </h1>
          <div className="rounded p-4 d-flex flex-column gap-2 slate-700">
            <div className='d-flex gap-3 justify-content-between'>
              <h1><strong>My Classes</strong></h1>
              <Link to="/add-class">
                <button type="button" className="btn fs-4 generic-button">
                  Add Class
                </button>
              </Link>
            </div>
            <Classes classType={"Created"} classes={createdClasses} />
            <Classes classType={"Teaching"} classes={teachingClasses} />
            <Classes classType={"Enrolled"} classes={enrolledClasses} />
          </div>
          <div className="rounded p-4 d-flex flex-column gap-2 slate-700">
            <h1><strong>Pending Invitations</strong></h1>
            <Invites
              role='tutor'
              populateClasses={() => populateClasses('tutor', setTeachingClasses)}
            />
            <Invites
              role='student'
              populateClasses={() => populateClasses('student', setEnrolledClasses)}
            />
          </div>
        </Container>
      </div>
    </WebPage>
  );
}
