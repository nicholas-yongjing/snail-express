import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./app/Firebase";

const app = firebaseApp;

export default app;
export const db = getFirestore(app);
