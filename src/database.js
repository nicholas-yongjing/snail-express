import { collection, addDoc, query, getDocs, where, setDoc, getDoc, doc } from "firebase/firestore";
import { firestore } from "./firebase";

async function createClass(className, headTutor, studentsEmail) {
    return await addDoc(collection(firestore, "classes"), {
        className: className,
        headTutor: headTutor,
        invites: studentsEmail,
        studentIds: []
    }).catch((err) => {
        console.log(`Error creating class: ${err}`);
    })
}

async function addUserToClass(classId, user, userType) {
    if (userType === 'student') {
        const classDocRef = doc(firestore, "classes", classId);
        getDoc(classDocRef)
            .then((snapshot) => {
                const oldStudentIds = snapshot.data().studentIds;
                setDoc(classDocRef,
                    {studentIds: [...oldStudentIds, user.id]}, 
                    {merge: true})
            });
        const studentDocRef = doc(firestore, "classes", classId, "students", user.id);
        return await setDoc(studentDocRef, user);
    } else {
        throw new Error(`Invalid user type: ${userType}`);
    }
}

async function getClasses(userId, role) {
    console.log("Retrieving classes")
    let q;
    if (role === 'student') {
        q = query(collection(firestore, "classes"),
            where('studentIds', 'array-contains', userId));
    } else if (role === 'tutor') {
        q = query(collection(firestore, "classes"),
            where('headTutor.id', '==', userId));
    } else {
        throw new Error(`Unknown role: ${role}`)
    }
    return (getDocs(q)
        .catch((err) => {
            console.log(`Error retrieving classes: ${err}`)
        }));
}

async function getInvites(email) {
    console.log("Retrieving invites")
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
    return await setDoc(doc(firestore, "classes", inviteId),
        { invites: newInvites },
        { merge: true });
}

async function acceptInvite(inviteId, studentId, email) {
    const snapshot = await getDoc(doc(firestore, "classes", inviteId));
    if (snapshot.data().invites.includes(email)) {
        return addUserToClass(inviteId,
            {
                id: studentId,
                email: email
            },
            'student')
            .then(deleteInvite(inviteId, email));
    } else {
        throw new Error('User is not invited to class and cannot accept invite');
    }


}

export { createClass, getInvites, acceptInvite, deleteInvite, getClasses };