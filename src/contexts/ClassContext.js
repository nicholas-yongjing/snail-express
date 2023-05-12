import { doc, getDoc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useFirestore } from "./FirestoreContext";

const ClassContext = createContext();

export function useClass() {
  return useContext(ClassContext);
}

export function ClassProvider({ children }) {
  const { currentUser } = useAuth();
  const [currentClass, setCurrentClass] = useState(null);
  const {firestore} = useFirestore();

  function _removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  function isTutor() {
    return (
      currentClass &&
      (currentClass.headTutor.id === currentUser.uid ||
        currentClass.tutorIds.includes(currentUser.uid))
    );
  }

  function isHeadTutor() {
    return currentClass && (currentClass.headTutor.id === currentUser.uid);
  }

  async function changeClassName(className) {
    if (currentClass) {
      const classRef = doc(firestore, "classes", currentClass.id);
      return getDoc(classRef)
        .then((snapshot) => {
          return setDoc(classRef, { ...snapshot.data(), className: className });
        }).then(() => {
          return setCurrentClass({ ...currentClass, className: className });
        }).catch((err) => {
          throw new Error(`Error setting class name: ${err}`);
        })
    }
  }

  async function addInvites(emails, role) {
    let field;
    if (role === "student") {
      field = "studentInvites";
    } else if (role === "tutor") {
      field = "tutorInvites";
    } else {
      throw new Error(`Unknown role: ${role}`);
    }

    const classRef = doc(firestore, "classes", currentClass.id);
    const newData = {};
    newData[field] = arrayUnion(...emails);
    return updateDoc(classRef, newData).then(() => {
      const updatedClass = { ...currentClass };
      updatedClass[field] = _removeDuplicates(currentClass[field].concat(emails));
      return setCurrentClass(updatedClass);
    });
  }

  const value = { currentClass, setCurrentClass, isTutor, changeClassName, addInvites, isHeadTutor };
  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
}
