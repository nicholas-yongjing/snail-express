import { firestore } from "./firebase";
import {
  doc, collection, addDoc, getDocs, getDoc, setDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, updateDoc, arrayUnion, arrayRemove,
} from "firebase/firestore";

function _removeDuplicates(arr) {
  return [...(new Set(arr))];
}

function validateEmails(emails) {
  const emailRequirement = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  for (const email of emails) {
    if (!email.match(emailRequirement)) {
      return false;
    }
  }
  return true;
}

async function createClass(className, headTutor, studentsEmail, tutorsEmail) {
  return await addDoc(collection(firestore, "classes"), {
    className: className,
    headTutor: headTutor,
    studentInvites: _removeDuplicates(studentsEmail).filter((email) => email !== headTutor.email),
    tutorInvites: _removeDuplicates(tutorsEmail).filter((email) => email !== headTutor.email),
    studentIds: [],
    tutorIds: [],
    timestamp: serverTimestamp()
  }).then((classSnaphot) =>
    _createDefaultSettings(classSnaphot.id)
  ).catch((err) => {
    console.log(err)
    throw new Error(`Error creating class: ${err}`);
  })
}

async function addInvites(classId, emails, role) {
  let field;
  if (role === 'student') {
    field = 'studentInvites';
  } else if (role === 'tutor') {
    field = 'tutorInvites';
  } else {
    throw new Error(`Unknown role: ${role}`);
  }

  const classRef = doc(firestore, "classes", classId);
  return getDoc(classRef).then((snapshot) => {
    const newInvites = _removeDuplicates(snapshot.data()[field].concat(emails));
    const newData = { ...snapshot.data() };
    newData[field] = newInvites;
    return setDoc(classRef, newData);
  }).catch((err) => {
    throw new Error(`Error sending invites: ${err}`);
  })
}

async function _addUserToClass(classId, user, role) {
  async function addUserToArray() {
    const classDocRef = doc(firestore, "classes", classId);
    const newData = {};
    const field = role === 'student' ? 'studentIds' : 'tutorIds';
    newData[field] = arrayUnion(user.id);
    return updateDoc(classDocRef, newData);
  }

  async function addUserDoc() {
    const field = role === 'student' ? 'students' : 'tutors';
    const userDocRef = doc(firestore, "classes", classId, field, user.id);
    return setDoc(userDocRef, user);
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
  const newData = {};
  newData[field] = arrayRemove(email);
  return updateDoc(doc(firestore, "classes", inviteId), newData);
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
  return getDoc(doc(firestore, "classes", inviteId)).then((snapshot) => {
    if (snapshot.data()[field].includes(email)) {
      return _addUserToClass(inviteId,
        {
          id: studentId,
          email: email,
          name: name,
          level: 0,
          exp: 0,
          dailyCounts: {
            posts: 0,
            votes: 0,
            feedbacks: 0,
            quizzesAttended: 0,
            quizCorrectAnswers: 0,
            lastUpdated: serverTimestamp()
          },
          overallCounts: {
            posts: 0,
            votes: 0,
            feedbacks: 0,
            quizzesAttended: 0,
            quizCorrectAnswers: 0,
          }
        },
        role)
        .then(() => deleteInvite(inviteId, 'student', email))
        .then(() => deleteInvite(inviteId, 'tutor', email));
    } else {
      throw new Error('User is not invited to class and cannot accept invite');
    }
  })
}

async function getUser(classId, userGroup, userId) {
  console.log("Retrieving user");
  if (userGroup !== 'students' && userGroup !== 'tutors') {
    throw new Error(`Invalid user group: ${userGroup}`)
  }
  const userRef = doc(firestore, "classes", classId, userGroup, userId);
  return getDoc(userRef).then((snapshot) => {
    return snapshot.data();
  }).catch((err) => {
    throw new Error(`Error retrieving user: ${err}`);
  });
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

async function _createDefaultSettings(classId) {
  const expRequirements = [];
  for (let i = 1; i < 101; i++) {
    expRequirements.push(10 * i * i);
  }

  setDoc(
    doc(firestore, "classes", classId, "settings", "levelling"),
    {
      expRequirements: expRequirements
    }
  )
}

async function getLevellingSettings(classId) {
  console.log('Retrieving Levelling Settings')
  const settingsRef = doc(firestore, 'classes', classId, 'settings', 'levelling');
  return getDoc(settingsRef)
    .then((snapshot) => {
      return snapshot.data();
    }).catch((err) => {
      throw new Error(`Error retrieving levelling settings: ${err}`);
    });
}

async function changeLevellingSettings(classId, newSettings) {
  const settingsRef = doc(firestore, 'classes', classId, 'settings', 'levelling');
  return setDoc(settingsRef, newSettings)
    .catch((err) => {
      throw new Error(`Error changing levelling settings: ${err}`);
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

async function _addExp(expType, classId, studentData) {
  const settingsRef = doc(firestore, "classes", classId, "settings", "levelling")
  const expGain = expType === 'posts' ? 50 : 10;
  studentData.exp += expGain;
  return getDoc(settingsRef).then((snapshot) => {
    const expRequirements = snapshot.data().expRequirements;
    while (studentData.level < expRequirements.length
      && studentData.exp >= expRequirements[studentData.level]) {
      studentData.level += 1;
    }
    return studentData;
  })
}

function resetDailyCounts(dailyCounts) {
  for (const field of dailyCounts.keys()) {
    dailyCounts[field] = 0;
  }
}

async function _incrementActivityCount(classId, userId, field) {
  const studentRef = doc(firestore, "classes", classId,
    "students", userId);
  return getDoc(studentRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const oldDailyCounts = snapshot.data().dailyCounts;
        const newDailyCounts = { ...oldDailyCounts };
        if (oldDailyCounts.lastUpdated.toDate().getDate() !== (new Date().getDate())) {
          resetDailyCounts(newDailyCounts);
        }
        newDailyCounts[field] += 1;
        newDailyCounts.lastUpdated = serverTimestamp();
        const newOverallCounts = { ...snapshot.data().overallCounts };
        newOverallCounts[field] += 1;

        const newStudentData = {
          ...snapshot.data(),
          dailyCounts: newDailyCounts,
          overallCounts: newOverallCounts
        };
        const activityLimit = field === 'posts' ? 3 : 1;
        if (newDailyCounts[field] <= activityLimit) {
          return _addExp(field, classId, newStudentData)
            .then((finalStudentData) => {
              setDoc(studentRef, finalStudentData);
            });
        } else {
          return setDoc(studentRef, newStudentData);
        }
      }
    }).catch((err) => {
      throw new Error(`Error increasing post count: ${err}`);
    });
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

  return await addDoc(postsRef, post).then(() => {
    _incrementActivityCount(classId, author.id, "posts")
  }).catch((err) => {
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
  return await addDoc(repliesRef, reply).then(() => {
    _incrementActivityCount(classId, author.id, "posts")
  }).catch((err) => {
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
      return await updateDoc(docRef, { upvoters: arrayRemove(userId) });
    } else if (voteType === 'upvote') {
      _incrementActivityCount(classId, userId, 'votes')
      return await updateDoc(docRef, { upvoters: arrayUnion(userId) });
    }
  }

  async function updateDownvoters(snapshot) {
    const downvoters = snapshot.data().downvoters;
    if (downvoters.includes(userId)) {
      return await updateDoc(docRef, { downvoters: arrayRemove(userId) });
    } else if (voteType === 'downvote') {
      _incrementActivityCount(classId, userId, 'votes')
      return await updateDoc(docRef, { downvoters: arrayUnion(userId) });
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
    throw new Error(`Error setting lecture feedback: ${err}`);
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
  validateEmails, createClass, addInvites,
  getInvites, acceptInvite, deleteInvite,
  getClasses, getUser, getStudents, getTutors,
  getLevellingSettings, changeLevellingSettings,
  addForumThread, getForumThreads, addForumPost,
  getForumPosts, addForumReply, getForumReplies,
  togglePostEndorsement, togglePostvote,
  setLectureFeedback, resetLectureFeedbacks
};
