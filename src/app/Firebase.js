import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FirestoreProvider } from "../contexts/FirestoreContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ClassProvider } from "../contexts/ClassContext";

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

export default function Firebase({ children }) {

  return (
      <AuthProvider auth={auth}>
        <FirestoreProvider firestore={firestore}>
          <ClassProvider>
            {children}
          </ClassProvider>
        </FirestoreProvider>
      </AuthProvider>
  );
}

export { firebaseApp };

