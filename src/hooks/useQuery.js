import { collection, query } from "firebase/firestore";
import { useFirestore } from "../contexts/FirestoreContext";

export default function useQuery(path, condition) {

  const { firestore } = useFirestore();
  const collectionRef = collection(firestore, path);
  const queryRef = query(collectionRef, where(...condition));
  
  /**
   * Gets an array of document data.
   */
  function getDocuments() {
    return getDocs(queryRef).then(querySnapshot => {
      return querySnapshot.docs.map(documentSnapshot => {
        return {...documentSnapshot.data(),id: documentSnapshot.id}
      });
    });
  }

  return { getDocuments };
}