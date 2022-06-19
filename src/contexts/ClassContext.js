import { createContext, useContext, useState} from "react";

const ClassContext = createContext();

export function useClass() {
  return useContext(ClassContext);
}

export function ClassProvider({ children }) {
  const [currentClass, setCurrentClass] = useState(null);

  return (
    <ClassContext.Provider value={{currentClass, setCurrentClass}}>
      {children}
    </ClassContext.Provider>
  );
}
