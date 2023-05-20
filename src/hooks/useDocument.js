import { deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { useFirestore } from "../contexts/FirestoreContext";

export default function useDocument(path) {

  const { firestore } = useFirestore();
  const docRef = doc(firestore, path);

  /**
   * Updates the given document with the updated object.
   *
   * @param {*} updater Function that takes in documentSnapshot.data() object and returns the updated data object.
   * @returns A promise that resolves once data has been updated sucessfully.
   */
  function updateDocument(newData) {
    return setDoc(docRef, newData);
  }

  /**
   * Updates the given document with an updater function.
   *
   * @param {*} updater Function that takes in documentSnapshot.data() object and returns the updated data object.
   * @returns A promise that resolves once data has been updated sucessfully.
   */
  function updateDocumentWith(updater) {
    return getDoc(docRef).then(snapshot => {
      return setDoc(docRef, updater(snapshot.data()));
    })
  }

  function deleteDocument() {
    return deleteDoc(docRef);
  }

  return { updateDocument, updateDocumentWith, deleteDocument };
}