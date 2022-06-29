import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ClassProvider, useClass } from "./contexts/ClassContext";

import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import AddClass from "./pages/AddClass";
import ClassDashboard from "./pages/ClassDashboard"
import SettingsGeneral from "./pages/SettingsGeneral";
import SettingsLevelling from "./pages/SettingsLevelling";
import SettingsForums from "./pages/SettingsForums";
import Forums from "./pages/Forums";
import LiveFeedback from "./pages/LiveFeedback";
import Students from "./pages/Students";
import Tutors from "./pages/Tutors";


function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/" />;
}

function ClassRoute({ children }) {
  const { currentClass } = useClass();
  return (
    <PrivateRoute>
        {currentClass ? children : <Navigate to='/dashboard' />}
    </PrivateRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClassProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
            <Route path="/add-class" element={<PrivateRoute><AddClass /></PrivateRoute>} />
            <Route path="/class-dashboard" element={<ClassRoute><ClassDashboard /></ClassRoute>} />
            <Route path="/settings-general" element={<ClassRoute><SettingsGeneral /></ClassRoute>} />
            <Route path="/settings-levelling" element={<ClassRoute><SettingsLevelling /></ClassRoute>} />
            <Route path="/settings-forums" element={<ClassRoute><SettingsForums /></ClassRoute>} />
            <Route path="/forums" element={<ClassRoute><Forums /></ClassRoute>} />
            <Route path="/livefeedback" element={<ClassRoute><LiveFeedback /></ClassRoute>} />
            <Route path="/students" element={<ClassRoute><Students /></ClassRoute>} />
            <Route path="/tutors" element={<ClassRoute><Tutors/></ClassRoute>} />
          </Routes>
        </ClassProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
