import React from "react";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import LandingPage from "./LandingPage";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";

import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />}> </Route>
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}></Route>
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
              <Route path="/signup" element={<SignUp />}> </Route>
              <Route path="/login" element={<Login />}> </Route>
              <Route path="/forgot-password" element={<ForgotPassword/>}> </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
