import React from "react";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./LandingPage";
import SignUp from "./SignUp";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />}> </Route>
              <Route path="/signup" element={<SignUp />}> </Route>
              <Route path="/login" element={<Login />}> </Route>
              <Route path="/forgot-password" element={<ForgotPassword/>}> </Route>
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}></Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </Container>
  );
}

export default App;
