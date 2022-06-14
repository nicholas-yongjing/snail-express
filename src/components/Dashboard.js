import React from "react";
import { useAuth } from "../contexts/AuthContext";

import NavigationBar from "./NavigationBar";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      <NavigationBar />
      <div className="fs-2">
        Welcome back! <strong>{currentUser.email}</strong>
      </div>
      <br></br>
      <div className="fs-2">You are currently on the dashboard page.</div>
    </>
  );
}
