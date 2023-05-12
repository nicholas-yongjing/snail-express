import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from "../contexts/ClassContext";

import LandingPage from "../pages/LandingPage";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import UpdateProfile from "../pages/UpdateProfile";
import AddClass from "../pages/AddClass";
import ClassDashboard from "../pages/ClassDashboard";
import Settings from "../pages/Settings";
import Forums from "../pages/Forums";
import LiveFeedback from "../pages/LiveFeedback";
import Students from "../pages/Students";
import Tutors from "../pages/Tutors";
import QuizDashboard from "../pages/QuizDashboard";
import CreateQuiz from "../pages/CreateQuiz";
import LiveQuiz from "../pages/LiveQuiz";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/" />;
}

function ClassRoute({ children }) {
  const { currentClass } = useClass();
  return (
    <PrivateRoute>
      {currentClass ? children : <Navigate to="/dashboard" />}
    </PrivateRoute>
  );
}

export default function AllRoutes(props) {
 
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/update-profile"
        element={
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-class"
        element={
          <PrivateRoute>
            <AddClass />
          </PrivateRoute>
        }
      />
      <Route
        path="/class-dashboard"
        element={
          <ClassRoute>
            <ClassDashboard />
          </ClassRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ClassRoute>
            <Settings />
          </ClassRoute>
        }
      />
      <Route
        path="/forums"
        element={
          <ClassRoute>
            <Forums />
          </ClassRoute>
        }
      />
      <Route
        path="/live-feedback"
        element={
          <ClassRoute>
            <LiveFeedback />
          </ClassRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ClassRoute>
            <Students />
          </ClassRoute>
        }
      />
      <Route
        path="/tutors"
        element={
          <ClassRoute>
            <Tutors />
          </ClassRoute>
        }
      />
      <Route
        path="/quiz-dashboard"
        element={
          <ClassRoute>
            <QuizDashboard />
          </ClassRoute>
        }
      />
      <Route
        path="/create-quiz"
        element={
          <ClassRoute>
            <CreateQuiz />
          </ClassRoute>
        }
      />
      <Route
        path="/live-quiz"
        element={
          <ClassRoute>
            <LiveQuiz />
          </ClassRoute>
        }
      />
    </Routes>
  )
}

