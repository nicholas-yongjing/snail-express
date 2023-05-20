import { collection } from "firebase/firestore";
import { useFirestore } from "../contexts/FirestoreContext";

export default function useCollection(path) {

  const { firestore } = useFirestore();
  const collectionRef = collection(firestore, path);
  
    return { };
}