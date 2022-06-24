import React from 'react';
import { Button } from 'react-bootstrap';
import { deleteDoc, getDocs, collection, doc } from "firebase/firestore";
import { firestore } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useClass } from '../contexts/ClassContext';

const FeedbackSettings = () => {
    const { currentUser } = useAuth();
    const { currentClass } = useClass();

    const resetResponseHandler = (event) => {
        event.preventDefault();
        const feedbackRef = collection(
            firestore,
            "classes",
            currentClass.id,
            "feedback"
          );
          const q = getDocs(feedbackRef).then((ss) =>
            ss.docs.map(d => {
              const newRef = doc(
                firestore,
                "classes",
                currentClass.id,
                "feedback", 
                d.id
              );
              deleteDoc(newRef).then(() => console.log("deleted" + d.id));
            })
          );
    };

    return 
    <Button onClick={resetResponseHandler}>
        <div>Reset responses</div>
    </Button>
};

export default FeedbackSettings;