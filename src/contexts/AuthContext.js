import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  updateProfile
} from "firebase/auth";
import { useFirebase } from "./FirebaseContext";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { auth } = useFirebase();
  const [currentUser, setCurrentUser] = useState({});

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setCurrentUser({});
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email) {
    return updateEmail(currentUser, email).then(() => {
      // console.log("Successfully updated email");
    });
  }

  function updateUserPassword(password) {
    return updatePassword(currentUser, password).then(() => {
      // console.log("Successfully updated password");
    });;
  }

  function setName(name) {
    const user = auth.currentUser;
    return updateProfile(user, {
      ...user,
      displayName: name
    }).then(() => {
      // console.log("Successfully updated user name!")
    });
  }

  function setProfile(link) {
    const user = auth.currentUser;
    return updateProfile(user, {
      ...user, 
      photoURL: link
    }).then(() => {
      // console.log("Successfully updated profile picture!")
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const value = {
    currentUser,
    setName,
    setProfile,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  );
}
