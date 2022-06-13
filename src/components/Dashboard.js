import { useAuth } from "../contexts/AuthContext";
import React from "react";
import NavigationBar from "./NavigationBar";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div>
      <NavigationBar />
      <div className="content dashboard">
        <div>
          Welcome back! <strong>{currentUser.email}</strong>
        </div>
        <div>
          You are currently on the dashboard page.
        </div>
      </div>
    </div>
  );
}
