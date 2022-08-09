import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import WebPage from "../components/WebPage";
import Header from "../components/Header";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <WebPage>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div
            className="w-100 fs-4 d-flex flex-column gap-4"
            style={{ maxWidth: "500px" }}
          >
            <Card className="slate-700 text-slate-200">
              <Card.Body>
                <Header
                  headerText="Profile"
                  buttonText="Back to dashboard"
                  linkTo="/dashboard"
                />
                {currentUser.photoURL !== null && (
                  <img
                    alt="User profile"
                    src={`${currentUser.photoURL}`}
                    style={{
                      height: "200px",
                      width: "220px",
                      borderRadius: "50%",
                    }}
                  />
                )}
                <div>
                  <strong>Name:</strong> {currentUser.displayName}
                </div>
                <div>
                  <strong>Email:</strong> {currentUser.email}
                </div>
                <Link
                  to="/update-profile"
                  className="btn generic-button fs-5 w-100 mt-3"
                >
                  Update profile
                </Link>
              </Card.Body>
            </Card>
          </div>
        </Container>
    </WebPage>
  );
}
