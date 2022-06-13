import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import NavigationBar from "./NavigationBar";

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <NavigationBar />
      <div className="content profile">
        {/* <img src={logo} className="img-responsive" alt="Website logo" height="150px" /> */}
        <h1>Profile</h1>
        <div className="info">
          <div>
            <strong>Name:</strong> Insert name here after linking database
          </div>
          <div>
            <strong>Email:</strong> {currentUser.email}
          </div>
          <div>
            <strong>Enrolled course:</strong> CP2106
          </div>
          <div>
            <strong>Role:</strong> Student
          </div>
        </div>
        <button className="generic-button" onClick={() => {navigate('/update-profile')}}>
          Update profile
        </button>
      </div>
    </div>
  );
}
