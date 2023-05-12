import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCIZsydh3K7j9-ghH4fF_Ki8qL3tik5548",
    authDomain: "snail-development.firebaseapp.com",
    projectId: "snail-development",
    storageBucket: "snail-development.appspot.com",
    messagingSenderId: "1061120922219",
    appId: "1:1061120922219:web:b1d63dec95afa53537d72e"
}

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const FirebaseContext = createContext();

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }) {

  const value = { auth, firestore };
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

