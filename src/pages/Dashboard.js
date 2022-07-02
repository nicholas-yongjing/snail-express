import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getClasses, getInvites } from "../database";
import WebPage from "../components/WebPage";
import Classes from "../components/Classes";
import Invites from "../components/Invites";
import { Container } from "react-bootstrap";
import Header from "../components/Header";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [createdClasses, setCreatedClasses] = useState([]);
  const [teachingClasses, setTeachingClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [tutorInvites, setTutorInvites] = useState([]);
  const [studentInvites, setStudentInvites] = useState([]);

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
        } else {
          setter([]);
        }
      })
    }
  }

  function populateInvites() {
    if (currentUser.email) {
      for (const [role, setter] of [['tutor', setTutorInvites],
                              ['student', setStudentInvites]]) {
        getInvites(currentUser.email, role).then((invites) => {
          if (invites) {
            setter(invites);
          } else {
            setter([]);
          }
        })
      }
    }
  }

  return (
    <WebPage>
      <Container fluid='md' className="p-5 d-flex flex-column gap-5 text-slate-200">
        <h1 className="fs-2">
          Welcome back, <strong>{currentUser.displayName}</strong>!
        </h1>
        <div className="rounded p-4 d-flex flex-column gap-4 slate-700">
          <Header
            headerText="My Classes"
            buttonText="AddClass"
            linkTo="/add-class"
          />
          <Classes classType={"Created"} classes={createdClasses} />
          <Classes classType={"Teaching"} classes={teachingClasses} />
          <Classes classType={"Enrolled"} classes={enrolledClasses} />
        </div>
        <div className="rounded p-4 d-flex flex-column gap-2 slate-700">
          <h1><strong>Pending Invitations</strong></h1>
          <Invites
            role='tutor'
            populateClasses={() => populateClasses('tutor', setTeachingClasses)}
            invites={tutorInvites}
            populateInvites={() => populateInvites()}
          />
          <Invites
            role='student'
            populateClasses={() => populateClasses('student', setEnrolledClasses)}
            invites={studentInvites}
            populateInvites={() => populateInvites()}
          />
        </div>
      </Container>
    </WebPage>
  );
}
