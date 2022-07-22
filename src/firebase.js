import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_PRODUCTION_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_PRODUCTION_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PRODUCTION_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_PRODUCTION_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_PRODUCTION_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_PRODUCTION_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_PRODUCTION_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);