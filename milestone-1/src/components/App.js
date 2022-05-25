import React from "react";
import SignUp from "./SignUp";
// import Login from "./Login";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <SignUp />
          {/* <Login /> */}
        </div>
      </Container>
    </AuthProvider>
  );
}

export default App;
