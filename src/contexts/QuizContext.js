import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useClass } from "./ClassContext";

const QuizContext = createContext();

export function useQuiz() {
  return useContext(QuizContext);
}

export function QuizProvider({ children }) {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const { currentClass, isTutor } = useClass();
  const { currentUser } = useAuth();

  const value = {
    currentQuiz,
    setCurrentQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
