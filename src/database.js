import { collection, addDoc, query, getDocs, where, setDoc, getDoc, doc } from "firebase/firestore";
import { firestore } from "./firebase";

async function createClass(className, headTutor, studentsEmail, tutorsEmail) {
  return await addDoc(collection(firestore, "classes"), {
    className: className,
    headTutor: headTutor,
    studentInvites: studentsEmail,
    tutorInvites: tutorsEmail,
    studentIds: [],
    tutorIds: []
  }).catch((err) => {
    console.log(`Error creating class: ${err}`);
  })
}

async function addUserToClass(classId, user, role) {
  async function addUserToArray() {
    const field = role === 'student' ? 'studentIds' : 'tutorIds';
    const classDocRef = doc(firestore, "classes", classId);
    return await getDoc(classDocRef)
      .then((snapshot) => {
        const newData = {};
        newData[field] = [...((snapshot.data())[field]), user.id]
        setDoc(classDocRef, newData, { merge: true })
      });  
  }

  async function addUserDoc() {
    const field = role === 'student' ? 'students' : 'tutors';
    const userDocRef = doc(firestore, "classes", classId, field, user.id);
    return await setDoc(userDocRef, user);
  }

  if (role !== 'student' && role !== 'tutor') {
    throw new Error(`Invalid user role: ${role}`);
  }
  return addUserToArray()
    .then(() => addUserDoc())
    .catch((err) => {
      console.log(`Error adding user to class: ${err}`);
    });
}

async function getClasses(userId, role) {
  console.log("Retrieving classes")
  let q;
  if (role === 'student') {
    q = query(collection(firestore, "classes"),
      where('studentIds', 'array-contains', userId));
  } else if (role === 'head tutor') {
    q = query(collection(firestore, "classes"),
      where('headTutor.id', '==', userId));
  } else if (role === 'tutor') {
    q = query(collection(firestore, "classes"),
      where('tutorIds', 'array-contains', userId));
  } else {
    throw new Error(`Unknown role: ${role}`)
  }
  return (getDocs(q)
    .then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...(docSnapshot.data()), id: docSnapshot.id };
      });
    }).catch((err) => {
      console.log(`Error retrieving classes: ${err}`)
    }));
}

async function getInvites(email, role) {
  console.log("Retrieving invites");
  let field;
  if (role === 'student') {
    field = 'studentInvites';
  } else if (role === 'tutor') {
    field = 'tutorInvites';
  } else {
    throw new Error(`Invalid role for invitation type: ${role}`)
  }
  const q = query(collection(firestore, "classes"),
    where(field, 'array-contains', email));
  return (getDocs(q)
    .then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...(docSnapshot.data()), id: docSnapshot.id };
      });
    }).catch((err) => {
      console.log(`Error retrieving invites: ${err}`)
    }));
}

async function deleteInvite(inviteId, role, email) {
  let field;
  if (role === 'student') {
    field = 'studentInvites';
  } else if (role === 'tutor') {
    field = 'tutorInvites';
  } else {
    throw new Error(`Invalid role for invitation type: ${role}`)
  }
  const clss = await getDoc(doc(firestore, "classes", inviteId));
  const newData = {};
  newData[field] = clss.data()[field].filter((invite) => invite !== email);
  return await setDoc(doc(firestore, "classes", inviteId),
    newData,
    { merge: true });
}

async function acceptInvite(inviteId, studentId, role, email) {
  let field;
  if (role === 'student') {
    field = 'studentInvites';
  } else if (role === 'tutor') {
    field = 'tutorInvites';
  } else {
    throw new Error(`Invalid role for invitation type: ${role}`)
  }
  const snapshot = await getDoc(doc(firestore, "classes", inviteId));
  if (snapshot.data()[field].includes(email)) {
    return addUserToClass(inviteId,
      {
        id: studentId,
        email: email
      },
      role)
      .then(deleteInvite(inviteId, role, email));
  } else {
    throw new Error('User is not invited to class and cannot accept invite');
  }
}

async function addForumThread(classId, threadName) {
  const threadsRef = collection(firestore, "classes", classId, "forumThreads");
  return (
    addDoc(threadsRef, { name: threadName })
      .catch((err) => {
        throw new Error(`Error adding forum thread: ${err}`);
      })
  );
}

async function getForumThreads(classId) {
  console.log("Retrieving forum threads");
  const threadsRef = collection(firestore, "classes", classId, "forumThreads");
  return (getDocs(threadsRef)
    .then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...(docSnapshot.data()), id: docSnapshot.id };
      });
    }).catch((err) => {
      throw new Error(`Error retrieving forum threads: ${err}`)
    }));
}

async function addForumPost(classId, threadId, postTitle, postBody, author) {
  const post = {
    title: postTitle,
    body: postBody,
    author: author,
    endorsed: null
  };
  const postsRef = collection(firestore, "classes",
    classId, "forumThreads", threadId, "forumPosts");
  return await addDoc(postsRef, post).catch((err) => {
    throw new Error(`Error creating post: ${err}`);
  });
}

async function getForumPosts(classId, threadId) {
  console.log("Retrieving forum posts")
  const postsRef = collection(firestore, "classes",
    classId, "forumThreads", threadId, "forumPosts");
  return (getDocs(postsRef)
    .then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...(docSnapshot.data()), id: docSnapshot.id };
      });
    }).catch((err) => {
      throw new Error(`Error retrieving forum posts: ${err}`)
    }));
}

export { createClass, getInvites, acceptInvite, deleteInvite, getClasses, addForumThread, getForumThreads, addForumPost, getForumPosts };
