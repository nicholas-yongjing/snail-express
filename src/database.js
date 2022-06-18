import { collection, addDoc, query, getDocs, where, setDoc, getDoc, doc } from "firebase/firestore";
import { firestore } from "./firebase";

async function createClass(className, headTutor, studentsEmail) {
    addDoc(collection(firestore, "classes"), {
        className: className,
        headTutor: headTutor,
        invites: studentsEmail
    }).catch((err) => {
        console.log(`Error creating class: ${err}`);
    })
}

async function getInvites(email) {
    const q = query(collection(firestore, "classes"),
                    where('invites', 'array-contains', email));
    return getDocs(q);
}

async function deleteInvite(inviteId, email) {
    const oldInvites = await getDoc(doc(firestore, "classes", inviteId));
    const newInvites = oldInvites.data().invites.filter((invite) => invite !== email);
    await setDoc(doc(firestore, "classes", inviteId),
            {invites: newInvites},
            {merge: true})
}

export { createClass, getInvites, deleteInvite };