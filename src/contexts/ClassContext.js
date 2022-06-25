import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const ClassContext = createContext();

export function useClass() {
  return useContext(ClassContext);
}

export function ClassProvider({ children }) {
  const [currentClass, setCurrentClass] = useState(null);
  const { currentUser } = useAuth();

  function isTutor() {
    return (
      currentClass &&
      (currentClass.headTutor.id === currentUser.uid ||
        currentClass.tutorIds.includes(currentUser.uid))
    );
  }

  return (
    <ClassContext.Provider value={{ currentClass, setCurrentClass, isTutor }}>
      {children}
    </ClassContext.Provider>
  );
}
