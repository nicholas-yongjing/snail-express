import { collection, addDoc, query, getDocs, where, setDoc, getDoc, doc, query } from "firebase/firestore";
import { firestore } from "./firebase";

async function createClass(className, headTutor, studentsEmail) {
    await addDoc(collection(firestore, "classes"), {
        className: className,
        headTutor: headTutor,
        invites: studentsEmail
    }).catch((err) => {
        console.log(`Error creating class: ${err}`);
    })
}

async function addUserToClass(classId, user, userType) {
    if (userType === 'student') {
        const docRef = doc(firestore, "classes", classId, "students", user.id);
        await setDoc(docRef, user);
    } else {
        throw new Error(`Invalid user type: ${userType}`);
    }
}

/*async function getClasses(userId) {
    const query = query(collection(firestore, 'classes'),
                    where());
}*/

async function getInvites(email) {
    const q = query(collection(firestore, "classes"),
        where('invites', 'array-contains', email));
    return (getDocs(q)
        .catch((err) => {
            console.log(`Error retrieving invites: ${err}`)
        }));

}

async function deleteInvite(inviteId, email) {
    const oldInvites = await getDoc(doc(firestore, "classes", inviteId));
    const newInvites = oldInvites.data().invites.filter((invite) => invite !== email);
    await setDoc(doc(firestore, "classes", inviteId),
        { invites: newInvites },
        { merge: true })
}

async function acceptInvite(inviteId, studentId, email) {
    const snapshot = await getDoc(doc(firestore, "classes", inviteId));
    if (snapshot.data().invites.includes(email)) {
        addUserToClass(inviteId,
            {
                id: studentId,
                email: email
            },
            'student');
        deleteInvite(inviteId, email);
    } else {
        throw new Error('User is not invited to class and cannot accept invite');
    }


}

export { createClass, getInvites, acceptInvite, deleteInvite };