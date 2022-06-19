import { Link } from "react-router-dom";
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
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h1 className="fs-2">
            Welcome back! <strong>{currentUser.email}</strong>
          </h1>
          <br></br>
          <div className="fs-2">You are currently on the dashboard page.</div>
          <Classes />
          <Invites />
          <Link to="/add-class">Add Class</Link>
        </div>
      </Container>
    </>
  );
}
