
import { useAuth } from "../contexts/AuthContext";
import { Container } from "react-bootstrap";

import NavigationBar from "../components/NavigationBar";
import Classes from "../components/Classes"; 
import Invites from "../components/Invites"; 

export default function Dashboard() {
  const { currentUser } = useAuth();


  return (
    <>
      <NavigationBar />
      <Container className="m-5 d-grid gap-3">
          <h1 className="fs-2">
            Welcome back, <strong>{currentUser.email}</strong>!
          </h1>
          <br></br>
          <Classes />
          <Invites />
      </Container>
    </>
  );
}
