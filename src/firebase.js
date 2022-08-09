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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);
