import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import firestore from "../firestore";
import WebPage from "../components/WebPage";
import Classes from "../components/Classes";
import Invites from "../components/Invites";
import { Container } from "react-bootstrap";
import Header from "../components/Header";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { getClasses, getInvites } = firestore;
  const [createdClasses, setCreatedClasses] = useState([]);
  const [teachingClasses, setTeachingClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [tutorInvites, setTutorInvites] = useState([]);
  const [studentInvites, setStudentInvites] = useState([]);

  const populateClasses = useCallback((role, setter) => {
    if (currentUser.email) {
      getClasses(currentUser.uid, role).then((classes) => {
        if (classes) {
          setter(classes);
        } else {
          setter([]);
        }
      })
    }
  }, [currentUser.uid, currentUser.email, getClasses]);

  const populateInvites = useCallback(() => {
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
  }, [currentUser.email, getInvites]);

  useEffect(() => {
    populateClasses('head tutor', setCreatedClasses);
    populateClasses('tutor', setTeachingClasses);
    populateClasses('student', setEnrolledClasses);
    populateInvites();
  }, [populateClasses, populateInvites]);

  return (
    <WebPage>
      <Container fluid='md' className="p-5 d-flex flex-column gap-5 text-slate-200">
        <h1 className="fs-2">
          Welcome back, <strong>{currentUser.displayName}</strong>!
        </h1>
        <div className="rounded p-4 d-flex flex-column gap-4 slate-700">
          <Header
            headerText="My Classes"
            buttonText="Add Class"
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
