import { firestore } from "./firebase";
import { doc, collection, addDoc, getDocs, getDoc, setDoc, deleteDoc,
  query, where, orderBy, serverTimestamp } from "firebase/firestore";
  
async function createClass(className, headTutor, studentsEmail, tutorsEmail) {
  return await addDoc(collection(firestore, "classes"), {
    className: className,
    headTutor: headTutor,
    studentInvites: studentsEmail,
    tutorInvites: tutorsEmail,
    studentIds: [],
    tutorIds: [],
    timestamp: serverTimestamp()
  }).catch((err) => {
    throw new Error(`Error creating class: ${err}`);
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
      throw new Error(`Error adding user to class: ${err}`);
    });
}

async function getClasses(userId, role) {
  console.log("Retrieving classes")
  let q;
  if (role === 'student') {
    q = query(collection(firestore, "classes"),
      where('studentIds', 'array-contains', userId), orderBy('timestamp'));
  } else if (role === 'head tutor') {
    q = query(collection(firestore, "classes"),
      where('headTutor.id', '==', userId), orderBy('timestamp'));
  } else if (role === 'tutor') {
    q = query(collection(firestore, "classes"),
      where('tutorIds', 'array-contains', userId), orderBy('timestamp'));
  } else {
    throw new Error(`Unknown role: ${role}`)
  }
  return (getDocs(q)
    .then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...(docSnapshot.data()), id: docSnapshot.id };
      });
    }).catch((err) => {
      throw new Error(`Error retrieving classes: ${err}`)
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
      throw new Error(`Error retrieving invites: ${err}`)
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

async function acceptInvite(inviteId, studentId, role, email, name) {
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
        email: email,
        name: name
      },
      role)
      .then(deleteInvite(inviteId, role, email));
  } else {
    throw new Error('User is not invited to class and cannot accept invite');
  }
}

async function getStudents(classId) {
  console.log("Retrieving students");
  const studentsRef = collection(firestore, "classes",
    classId, "students");
  return getDocs(studentsRef)
    .then((snapshot) => {
      return (snapshot.docs.map((doc) => {
        return doc.data();
      }));
    }).catch((err) => {
      throw new Error(`Error retrieving students: ${err}`)
    });
}

async function getTutors(classId) {
  console.log("Retrieving tutors");
  const tutorsRef = collection(firestore, "classes",
    classId, "tutors");
  return getDocs(tutorsRef)
    .then((snapshot) => {
      return (snapshot.docs.map((doc) => {
          return doc.data();
      }));
    }).catch((err) => {
      throw new Error(`Error retrieving tutors: ${err}`)
    });
}

async function addForumThread(classId, threadName) {
  const threadsRef = collection(firestore, "classes", classId, "forumThreads");
  return (
    addDoc(threadsRef, {
        name: threadName,
        timestamp: serverTimestamp()
      })
      .catch((err) => {
        throw new Error(`Error adding forum thread: ${err}`);
      })
  );
}

async function getForumThreads(classId) {
  console.log("Retrieving forum threads");
  const threadsRef = collection(firestore, "classes", classId, "forumThreads");
  return (getDocs(query(threadsRef, orderBy('timestamp')))
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
    endorsed: false,
    upvoters: [],
    downvoters: [],
    timestamp: serverTimestamp()
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
  return (getDocs(query(postsRef, orderBy('timestamp')))
    .then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...(docSnapshot.data()), id: docSnapshot.id };
      });
    }).catch((err) => {
      console.log(`Error retrieving forum posts: ${err}`)
    }));
}

async function addForumReply(classId, threadId, postId, postBody, author) {
  const reply = {
    body: postBody,
    author: author,
    endorsed: false,
    upvoters: [],
    downvoters: [],
    timestamp: serverTimestamp()
  };
  const repliesRef = collection(firestore, "classes", classId,
    "forumThreads", threadId, "forumPosts", postId, "forumReplies");
  return await addDoc(repliesRef, reply).catch((err) => {
    throw new Error(`Error creating post: ${err}`);
  });
}

async function getForumReplies(classId, threadId, postId) {
  console.log("Retrieving forum replies");
  const repliesRef = collection(firestore, "classes",
    classId, "forumThreads", threadId, "forumPosts", postId, "forumReplies");
  return (getDocs(query(repliesRef, orderBy('timestamp')))
    .then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...(docSnapshot.data()), id: docSnapshot.id };
      });
    }).catch((err) => {
      throw new Error(`Error retrieving forum replies: ${err}`)
    }));
}

async function togglePostEndorsement(classId, threadId, postId, replyId = null) {
  let docRef;
  if (replyId === null) {
    docRef = doc(firestore, "classes", classId,
      "forumThreads", threadId, "forumPosts", postId);
  } else {
    docRef = doc(firestore, "classes", classId,
      "forumThreads", threadId, "forumPosts", postId,
      "forumReplies", replyId);
  }
  return await getDoc(docRef)
    .then((snapshot) => {
      setDoc(docRef,
        { endorsed: !snapshot.data().endorsed },
        { merge: true }
      )
    }).catch((err) => {
      throw new Error(`Error toggling post endorsement: ${err}`);
    })
}

async function togglePostvote(userId, voteType, classId, threadId, postId, replyId = null) {
  function getDocRef() {
    if (replyId === null) {
      return doc(firestore, "classes", classId,
        "forumThreads", threadId, "forumPosts", postId);
    } else {
      return doc(firestore, "classes", classId,
        "forumThreads", threadId, "forumPosts", postId,
        "forumReplies", replyId);
    }
  }

  async function updateUpvoters(snapshot) {
    const upvoters = snapshot.data().upvoters;
    if (upvoters.includes(userId)) {
      return await setDoc(docRef,
        { upvoters: upvoters.filter((id) => id !== userId) },
        { merge: true }
      );
    } else if (voteType === 'upvote') {
      return await setDoc(docRef,
        { upvoters: [...upvoters, userId] },
        { merge: true }
      );
    }
  }

  async function updateDownvoters(snapshot) {
    const downvoters = snapshot.data().downvoters;
    if (downvoters.includes(userId)) {
      return await setDoc(docRef,
        { downvoters: downvoters.filter((id) => id !== userId) },
        { merge: true }
      );
    } else if (voteType === 'downvote') {
      return await setDoc(docRef,
        { downvoters: [...downvoters, userId] },
        { merge: true }
      );
    }
  }

  const docRef = getDocRef();
  return await getDoc(docRef)
    .then((snapshot) => {
      updateUpvoters(snapshot);
      updateDownvoters(snapshot);
    }).catch((err) => {
      throw new Error(`Error toggling post endorsement: ${err}`);
    })
}

async function setLectureFeedback(classId, user, reaction) {
    const feedbackRef = collection(firestore, "classes",
    classId, "feedback");
    return setDoc(doc(feedbackRef, user.uid), {
      name: user.displayName,
      reaction: reaction,
    }).catch((err) => {
      throw new Error (`Error setting lecture feedback: ${err}`);
    });
}

async function resetLectureFeedbacks(classId) {
  const feedbackRef = collection(firestore, "classes",
    classId, "feedback");
  return getDocs(feedbackRef)
    .then((snapshot) => {
      snapshot.docs.forEach((docu) => {
        const docRef = doc(feedbackRef, docu.id);
        deleteDoc(docRef);
      });
    }).catch((err) => {
      throw new Error(`Error reseting lecture feedbacks: ${err}`);
    });
}

export {
  createClass, getInvites, acceptInvite, deleteInvite,
  getClasses, getStudents, getTutors,
  addForumThread, getForumThreads, addForumPost,
  getForumPosts, addForumReply, getForumReplies,
  togglePostEndorsement, togglePostvote,
  setLectureFeedback, resetLectureFeedbacks
};
