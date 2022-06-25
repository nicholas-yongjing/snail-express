import { Container, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";

import NavigationBar from "../components/NavigationBar";

export default function Profile() {
  const { currentUser } = useAuth();
  const {currentClass, isTutor } = useClass();
  return (
    <>
      <NavigationBar />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div>
          <Card className="d-flex align-items-center" style={{minWidth: "300px"}}>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {currentUser.photoURL != null && <img src={`${currentUser.photoURL}`} style={{height: "200px", width: "220px", borderRadius: "50%"}}/>}
              
              <div className="mt-3">
                <strong>Name:</strong> {currentUser.displayName}
              </div>
              <div>
                <strong>Email:</strong> {currentUser.email}
              </div>
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update profile
              </Link>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
