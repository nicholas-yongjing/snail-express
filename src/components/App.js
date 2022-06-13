import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import LandingPage from "./LandingPage";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";

import '../style.css';

//Do we need this?
import NavigationBar from "./NavigationBar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />}> </Route>
          <Route path="/signup" element={<SignUp />}> </Route>
          <Route path="/login" element={<Login />}> </Route>
          <Route path="/forgot-password" element={<ForgotPassword />}> </Route>F
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
          <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}></Route>
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
          <Route path="/navigation-bar" element={<NavigationBar />}> </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
