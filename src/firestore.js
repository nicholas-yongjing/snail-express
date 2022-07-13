import { getFirestore } from "firebase/firestore";
import app from "./firebase";
import getDatabase from "./database";

const firestore = getDatabase(getFirestore(app));

export default firestore;