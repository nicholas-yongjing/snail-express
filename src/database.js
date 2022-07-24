import {
  doc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

export default function getDatabase(firestore) {
  const LOG = true;

  async function pullRevisionQuizList(className, setter) {
    const q = query(
      collection(firestore, "classes", className, "quizzes"),
      where("revision", "==", true)
    );

    return getDocs(q).then(async (snapshot) => {
      return Promise.all(
        snapshot.docs.map(async (document) => {
          const q = query(
            collection(
              firestore,
              "classes",
              className,
              "quizzes",
              document.id,
              "questions"
            ),
            orderBy("id")
          );
          return await getDocs(q);
        })
      ).then(async (promises) => {
        return setter(
          promises.map((questions) => {
            return {
              id: questions.query._query.path.segments[3], // get quiz name from path
              data: questions.docs,
            };
          })
        );
      });
    });
  }

  function submitAnswer(className, quizName, currentQuestion, response) {
    const questionRef = doc(
      firestore,
      "classes",
      className,
      "quizzes",
      quizName,
      "questions",
      `${currentQuestion + 1}`
    );

    if (response === "A") {
      return updateDoc(questionRef, {
        "responses.A": increment(1),
        "responses.total": increment(1),
      });
    } else if (response === "B") {
      return updateDoc(questionRef, {
        "responses.B": increment(1),
        "responses.total": increment(1),
      });
    } else if (response === "C") {
      return updateDoc(questionRef, {
        "responses.C": increment(1),
        "responses.total": increment(1),
      });
    } else {
      return updateDoc(questionRef, {
        "responses.D": increment(1),
        "responses.total": increment(1),
      });
    }
  }

  function toggleRevision(className, quizName, revision) {
    return updateDoc(
      doc(firestore, "classes", className, "quizzes", quizName),
      {
        revision: !revision,
      }
    );
  }

  function deleteQuiz(className, quizName) {
    return deleteDoc(doc(firestore, "classes", className, "quizzes", quizName));
  }

  function showPreviousQuestion(className, quizName, currentQuestion) {
    return updateDoc(
      doc(firestore, "classes", className, "quizzes", quizName),
      {
        currentQuestion: currentQuestion - 1,
      }
    );
  }

  function showNextQuestion(className, quizName, currentQuestion) {
    return updateDoc(
      doc(firestore, "classes", className, "quizzes", quizName),
      {
        currentQuestion: currentQuestion + 1,
      }
    );
  }

  async function activateQuiz(className, quizName) {
    await updateDoc(doc(firestore, "classes", className, "quizzes", quizName), {
      live: true,
      currentQuestion: 0,
    });
    return getDocs(
      collection(
        firestore,
        "classes",
        className,
        "quizzes",
        quizName,
        "questions"
      )
    ).then((snapshot) => {
      snapshot.docs.map((question) => {
        return updateDoc(doc(firestore, question.ref.path), {
          responses: {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            total: 0,
          },
        });
      });
    });
  }

  async function deactivateQuiz(className, quizName) {
    await updateDoc(doc(firestore, "classes", className, "quizzes", quizName), {
      live: false,
      currentQuestion: 0,
    });
    return getDocs(
      collection(
        firestore,
        "classes",
        className,
        "quizzes",
        quizName,
        "questions"
      )
    ).then((snapshot) => {
      snapshot.docs.map((question) => {
        return updateDoc(doc(firestore, question.ref.path), {
          responses: {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            total: 0,
          },
        });
      });
    });
  }

  async function pullQuizList(className, setter) {
    return await getDocs(
      collection(firestore, "classes", className, "quizzes")
    ).then(async (snapshot) => {
      return Promise.all(
        snapshot.docs.map(async (document) => {
          const q = query(
            collection(
              firestore,
              "classes",
              className,
              "quizzes",
              document.id,
              "questions"
            ),
            orderBy("id")
          );
          return await getDocs(q);
        })
      ).then(async (promises) => {
        return setter(
          promises.map((questions) => {
            return {
              id: questions.query._query.path.segments[3], // get quiz name from path
              data: questions.docs,
            };
          })
        );
      });
    });
  }

  async function resetQuiz(className) {
    return getDocs(collection(firestore, "classes", className, "quizzes")).then(
      (snapshot) => {
        snapshot.docs.map((document) =>
          updateDoc(doc(firestore, document.ref.path), {
            live: false,
            currentQuestion: 0,
          })
        );
      }
    );
  }

  async function createQuiz(className, quizName) {
    return setDoc(
      doc(firestore, "classes", className, "quizzes", `${quizName}`),
      {
        live: false,
        revision: false,
        currentQuestion: 0,
      }
    );
  }

  async function createQuestion(className, quizName, count, questionObj) {
    return setDoc(
      doc(
        firestore,
        "classes",
        className,
        "quizzes",
        quizName,
        "questions",
        `${count}`
      ),
      questionObj
    );
  }

  function _removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  function validateEmails(emails) {
    const emailRequirement =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    for (const email of emails) {
      if (!email.match(emailRequirement)) {
        return false;
      }
    }
    return true;
  }

  async function _createDefaultSettings(classId) {
    const expRequirements = [];
    for (let i = 1; i < 101; i++) {
      expRequirements.push(10 * i * i);
    }

    return setDoc(doc(firestore, "classes", classId, "settings", "levelling"), {
      expRequirements: expRequirements,
      limits: {
        posts: 3,
        votes: 1,
        feedbacks: 1,
        quizzesAttended: 3,
        quizCorrectAnswers: 3,
      },
      expGain: {
        posts: 50,
        votes: 10,
        feedbacks: 100,
        quizzesAttended: 50,
        quizCorrectAnswers: 10,
      },
    });
  }

  async function createClass(className, headTutor, studentsEmail, tutorsEmail) {
    return await addDoc(collection(firestore, "classes"), {
      className: className,
      headTutor: headTutor,
      studentInvites: _removeDuplicates(studentsEmail).filter(
        (email) => email !== headTutor.email
      ),
      tutorInvites: _removeDuplicates(tutorsEmail).filter(
        (email) => email !== headTutor.email
      ),
      studentIds: [],
      tutorIds: [],
      timestamp: serverTimestamp(),
    }).then(async (classSnaphot) => {
      return _createDefaultSettings(classSnaphot.id).then(() => classSnaphot);
    });
  }

  async function _addUserToClass(classId, user, role) {
    async function addUserToArray() {
      const classDocRef = doc(firestore, "classes", classId);
      const newData = {};
      const field = role === "student" ? "studentIds" : "tutorIds";
      newData[field] = arrayUnion(user.id);
      return updateDoc(classDocRef, newData);
    }

    async function addUserDoc() {
      const field = role === "student" ? "students" : "tutors";
      const userDocRef = doc(firestore, "classes", classId, field, user.id);
      return setDoc(userDocRef, user);
    }

    if (role !== "student" && role !== "tutor") {
      throw new Error(`Invalid user role: ${role}`);
    }
    return addUserToArray().then(() => addUserDoc());
  }

  async function getClasses(userId, role) {
    if (LOG) {
      console.log("Retrieving classes");
    }
    let q;
    if (role === "student") {
      q = query(
        collection(firestore, "classes"),
        where("studentIds", "array-contains", userId),
        orderBy("timestamp")
      );
    } else if (role === "head tutor") {
      q = query(
        collection(firestore, "classes"),
        where("headTutor.id", "==", userId),
        orderBy("timestamp")
      );
    } else if (role === "tutor") {
      q = query(
        collection(firestore, "classes"),
        where("tutorIds", "array-contains", userId),
        orderBy("timestamp")
      );
    } else {
      throw new Error(`Unknown role: ${role}`);
    }
    return getDocs(q).then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...docSnapshot.data(), id: docSnapshot.id };
      });
    });
  }

  async function getInvites(email, role) {
    if (LOG) {
      console.log("Retrieving invites");
    }
    let field;
    if (role === "student") {
      field = "studentInvites";
    } else if (role === "tutor") {
      field = "tutorInvites";
    } else {
      throw new Error(`Invalid role for invitation type: ${role}`);
    }
    const q = query(
      collection(firestore, "classes"),
      where(field, "array-contains", email)
    );
    return getDocs(q).then((querySnapshot) => {
      return querySnapshot.docs.map((docSnapshot) => {
        return { ...docSnapshot.data(), id: docSnapshot.id };
      });
    });
  }

  async function deleteInvite(inviteId, role, email) {
    let field;
    if (role === "student") {
      field = "studentInvites";
    } else if (role === "tutor") {
      field = "tutorInvites";
    } else {
      throw new Error(`Invalid role for invitation type: ${role}`);
    }
    const newData = {};
    newData[field] = arrayRemove(email);
    return updateDoc(doc(firestore, "classes", inviteId), newData);
  }

  async function acceptInvite(inviteId, userId, role, email, name) {
    function createUserData(role) {
      if (role === "student") {
        return {
          id: userId,
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
            lastUpdated: serverTimestamp(),
          },
          overallCounts: {
            posts: 0,
            votes: 0,
            feedbacks: 0,
            quizzesAttended: 0,
            quizCorrectAnswers: 0,
          },
        };
      } else {
        return {
          id: userId,
          email: email,
          name: name,
        };
      }
    }
    let field;
    if (role === "student") {
      field = "studentInvites";
    } else if (role === "tutor") {
      field = "tutorInvites";
    } else {
      throw new Error(`Invalid role for invitation type: ${role}`);
    }
    return getDoc(doc(firestore, "classes", inviteId)).then((snapshot) => {
      if (snapshot.data()[field].includes(email)) {
        return _addUserToClass(inviteId, createUserData(role), role)
          .then(() => deleteInvite(inviteId, "student", email))
          .then(() => deleteInvite(inviteId, "tutor", email));
      } else {
        throw new Error(
          "User is not invited to class and cannot accept invite"
        );
      }
    });
  }

  async function getUser(classId, userGroup, userId) {
    if (LOG) {
      console.log("Retrieving user");
    }
    if (userGroup !== "students" && userGroup !== "tutors") {
      throw new Error(`Invalid user group: ${userGroup}`);
    }
    const userRef = doc(firestore, "classes", classId, userGroup, userId);
    return getDoc(userRef).then((snapshot) => {
      return snapshot.data();
    });
  }

  async function getStudents(classId) {
    if (LOG) {
      console.log("Retrieving students");
    }
    const studentsRef = collection(firestore, "classes", classId, "students");
    return getDocs(studentsRef).then((snapshot) => {
      return snapshot.docs.map((doc) => {
        return doc.data();
      });
    });
  }

  async function getTutors(classId) {
    if (LOG) {
      console.log("Retrieving tutors");
    }
    const tutorsRef = collection(firestore, "classes", classId, "tutors");
    return getDocs(tutorsRef).then((snapshot) => {
      return snapshot.docs.map((doc) => {
        return doc.data();
      });
    });
  }

  async function getLevellingSettings(classId) {
    if (LOG) {
      console.log("Retrieving Levelling Settings");
    }
    const settingsRef = doc(
      firestore,
      "classes",
      classId,
      "settings",
      "levelling"
    );
    return getDoc(settingsRef).then((snapshot) => {
      return snapshot.data();
    });
  }

  async function changeLevellingSettings(classId, newSettings) {
    const settingsRef = doc(
      firestore,
      "classes",
      classId,
      "settings",
      "levelling"
    );
    return updateDoc(settingsRef, newSettings);
  }

  async function addForumThread(classId, threadName) {
    const threadsRef = collection(
      firestore,
      "classes",
      classId,
      "forumThreads"
    );
    return addDoc(threadsRef, {
      name: threadName,
      timestamp: serverTimestamp(),
    });
  }

  async function getForumThreads(classId) {
    if (LOG) {
      console.log("Retrieving forum threads");
    }
    const threadsRef = collection(
      firestore,
      "classes",
      classId,
      "forumThreads"
    );
    return getDocs(query(threadsRef, orderBy("timestamp"))).then(
      (querySnapshot) => {
        return querySnapshot.docs.map((docSnapshot) => {
          return { ...docSnapshot.data(), id: docSnapshot.id };
        });
      }
    );
  }

  async function _incrementActivityCount(classId, userId, field) {
    function resetDailyCounts(dailyCounts) {
      for (const field of dailyCounts.keys()) {
        dailyCounts[field] = 0;
      }
    }

    function updateData(userData) {
      const newDailyCounts = { ...userData.dailyCounts };
      if (
        newDailyCounts.lastUpdated.toDate().getDate() !== new Date().getDate()
      ) {
        resetDailyCounts(newDailyCounts);
      }
      newDailyCounts[field] += 1;
      newDailyCounts.lastUpdated = serverTimestamp();

      const newOverallCounts = { ...userData.overallCounts };
      newOverallCounts[field] += 1;

      return {
        ...userData,
        dailyCounts: newDailyCounts,
        overallCounts: newOverallCounts,
      };
    }

    function updateLevel(studentData, expRequirements) {
      while (
        studentData.level < expRequirements.length &&
        studentData.exp >= expRequirements[studentData.level]
      ) {
        studentData.level += 1;
      }
    }

    const studentRef = doc(firestore, "classes", classId, "students", userId);
    return getDoc(studentRef).then((snapshot) => {
      if (snapshot.exists()) {
        const newData = updateData(snapshot.data());
        return getLevellingSettings(classId).then((settings) => {
          if (newData.dailyCounts[field] <= settings.limits[field]) {
            newData.exp += settings.expGain[field];
          }
          updateLevel(newData, settings.expRequirements);
          return setDoc(studentRef, newData);
        });
      }
    });
  }

  async function addForumPost(
    classId,
    threadId,
    postTitle,
    postBody,
    authorId
  ) {
    const post = {
      title: postTitle,
      body: postBody,
      authorId: authorId,
      endorsed: false,
      upvoters: [],
      downvoters: [],
      timestamp: serverTimestamp(),
    };
    const postsRef = collection(
      firestore,
      "classes",
      classId,
      "forumThreads",
      threadId,
      "forumPosts"
    );

    return addDoc(postsRef, post).then((snapshot) => {
      return _incrementActivityCount(classId, authorId, "posts").then(
        () => snapshot
      );
    });
  }

  async function getForumPosts(classId, threadId) {
    if (LOG) {
      console.log("Retrieving forum posts");
    }
    const postsRef = collection(
      firestore,
      "classes",
      classId,
      "forumThreads",
      threadId,
      "forumPosts"
    );
    return getDocs(query(postsRef, orderBy("timestamp"))).then(
      (querySnapshot) => {
        return querySnapshot.docs.map((docSnapshot) => {
          return { ...docSnapshot.data(), id: docSnapshot.id };
        });
      }
    );
  }

  async function editForumPost(classId, threadId, postId, postTitle, postBody) {
    const post = {
      title: postTitle,
      body: postBody,
    };
    const postRef = doc(
      firestore,
      "classes",
      classId,
      "forumThreads",
      threadId,
      "forumPosts",
      postId
    );

    return updateDoc(postRef, post);
  }

  async function addForumReply(classId, threadId, postId, postBody, authorId) {
    const reply = {
      body: postBody,
      authorId: authorId,
      endorsed: false,
      upvoters: [],
      downvoters: [],
      timestamp: serverTimestamp(),
    };
    const repliesRef = collection(
      firestore,
      "classes",
      classId,
      "forumThreads",
      threadId,
      "forumPosts",
      postId,
      "forumReplies"
    );
    return addDoc(repliesRef, reply).then((snapshot) => {
      return _incrementActivityCount(classId, authorId, "posts").then(
        () => snapshot
      );
    });
  }

  async function getForumReplies(classId, threadId, postId) {
    if (LOG) {
      console.log("Retrieving forum replies");
    }
    const repliesRef = collection(
      firestore,
      "classes",
      classId,
      "forumThreads",
      threadId,
      "forumPosts",
      postId,
      "forumReplies"
    );
    return getDocs(query(repliesRef, orderBy("timestamp"))).then(
      (querySnapshot) => {
        return querySnapshot.docs.map((docSnapshot) => {
          return { ...docSnapshot.data(), id: docSnapshot.id };
        });
      }
    );
  }

  async function editForumReply(classId, threadId, postId, replyId, postBody) {
    const reply = {
      body: postBody,
    };
    const replyRef = doc(
      firestore,
      "classes",
      classId,
      "forumThreads",
      threadId,
      "forumPosts",
      postId,
      "forumReplies",
      replyId
    );
    return updateDoc(replyRef, reply);
  }

  async function togglePostEndorsement(
    classId,
    threadId,
    postId,
    replyId = null
  ) {
    let docRef;
    if (replyId === null) {
      docRef = doc(
        firestore,
        "classes",
        classId,
        "forumThreads",
        threadId,
        "forumPosts",
        postId
      );
    } else {
      docRef = doc(
        firestore,
        "classes",
        classId,
        "forumThreads",
        threadId,
        "forumPosts",
        postId,
        "forumReplies",
        replyId
      );
    }
    return getDoc(docRef).then((snapshot) => {
      return setDoc(
        docRef,
        { endorsed: !snapshot.data().endorsed },
        { merge: true }
      );
    });
  }

  async function togglePostvote(
    userId,
    voteType,
    classId,
    threadId,
    postId,
    replyId = null
  ) {
    function getDocRef() {
      if (replyId === null) {
        return doc(
          firestore,
          "classes",
          classId,
          "forumThreads",
          threadId,
          "forumPosts",
          postId
        );
      } else {
        return doc(
          firestore,
          "classes",
          classId,
          "forumThreads",
          threadId,
          "forumPosts",
          postId,
          "forumReplies",
          replyId
        );
      }
    }

    async function updateUpvoters(snapshot) {
      const upvoters = snapshot.data().upvoters;
      if (upvoters.includes(userId)) {
        return updateDoc(docRef, { upvoters: arrayRemove(userId) });
      } else if (voteType === "upvote") {
        return Promise.all([
          _incrementActivityCount(classId, userId, "votes"),
          updateDoc(docRef, { upvoters: arrayUnion(userId) }),
        ]);
      }
    }

    async function updateDownvoters(snapshot) {
      const downvoters = snapshot.data().downvoters;
      if (downvoters.includes(userId)) {
        return await updateDoc(docRef, { downvoters: arrayRemove(userId) });
      } else if (voteType === "downvote") {
        return Promise.all([
          _incrementActivityCount(classId, userId, "votes"),
          updateDoc(docRef, { downvoters: arrayUnion(userId) }),
        ]);
      }
    }

    const docRef = getDocRef();
    return getDoc(docRef).then((snapshot) => {
      return Promise.all([
        updateUpvoters(snapshot),
        updateDownvoters(snapshot),
      ]);
    });
  }

  async function setLectureFeedback(classId, user, reaction) {
    const feedbackRef = collection(firestore, "classes", classId, "feedback");
    return setDoc(doc(feedbackRef, user.uid), {
      name: user.displayName,
      reaction: reaction,
    });
  }

  async function resetLectureFeedbacks(classId) {
    const feedbackRef = collection(firestore, "classes", classId, "feedback");
    return getDocs(feedbackRef).then((snapshot) => {
      return snapshot.docs.forEach((docu) => {
        const docRef = doc(feedbackRef, docu.id);
        return deleteDoc(docRef);
      });
    });
  }

  return {
    validateEmails,
    createClass,
    getInvites,
    acceptInvite,
    deleteInvite,
    getClasses,
    getUser,
    getStudents,
    getTutors,
    getLevellingSettings,
    changeLevellingSettings,
    addForumThread,
    getForumThreads,
    addForumPost,
    getForumPosts,
    editForumPost,
    addForumReply,
    getForumReplies,
    editForumReply,
    togglePostEndorsement,
    togglePostvote,
    setLectureFeedback,
    resetLectureFeedbacks,
    createQuestion,
    createQuiz,
    resetQuiz,
    pullQuizList,
    activateQuiz,
    deactivateQuiz,
    showNextQuestion,
    showPreviousQuestion,
    deleteQuiz,
    toggleRevision,
    submitAnswer,
    pullRevisionQuizList,
    _incrementActivityCount,
  };
}
