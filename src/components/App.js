import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

import LandingPage from "./LandingPage";
import SignUp from "./SignUp";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";

import '../style.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />}> </Route>
          <Route path="/signup" element={<SignUp />}> </Route>
          <Route path="/login" element={<Login />}> </Route>
          <Route path="/forgot-password" element={<ForgotPassword />}> </Route>F
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
          <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}></Route>
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
