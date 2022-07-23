/**
 * Make sure all async functions complete within each test case
 * to avoid errors "spilling over" to other test cases.
 */

const { readFileSync, createWriteStream } = require("fs");
const http = require("http");
const testing = require("@firebase/rules-unit-testing");
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const {
  setLogLevel,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} = require("firebase/firestore");
const getDatabase = require("../database").default;

let testEnv;

beforeAll(async () => {
  // Silence expected rules rejections from Firestore SDK.
  setLogLevel("error");

  testEnv = await initializeTestEnvironment({
    projectId: "test-questions-1234",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();

  // Write the coverage report to a file
  const coverageFile = "firestore-coverage.html";
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    const { host, port } = testEnv.emulators.firestore;
    const quotedHost = host.includes(":") ? `[${host}]` : host;
    http.get(
      `http://${quotedHost}:${port}/emulator/v1/projects/${testEnv.projectId}:ruleCoverage.html`,
      (res) => {
        res.pipe(fstream, { end: true });

        res.on("end", resolve);
        res.on("error", reject);
      }
    );
  });
});

beforeEach(async () => {
  return await testEnv.clearFirestore();
});

describe("Questions", () => {
  it("should only allow head tutors and tutors to create questions", async () => {
    const headTutorFirestore = testEnv
      .authenticatedContext("head-tutor-name")
      .firestore();
    const headTutorDB = getDatabase(headTutorFirestore);
    const studentFirestore = testEnv
      .authenticatedContext("student-name", { email: "student@email.com" })
      .firestore();
    const studentDB = getDatabase(studentFirestore);
    const tutorFirestore = testEnv
      .authenticatedContext("tutor-name", { email: "tutor@email.com" })
      .firestore();
    const tutorDB = getDatabase(tutorFirestore);

    await headTutorDB
      .createClass(
        "classname",
        {
          name: "Head Tutor",
          id: "head-tutor-name",
          email: "head-tutor@email.com",
        },
        ["student@email.com"],
        ["tutor@email.com"]
      )
      .then(() => {
        return Promise.all([
          studentDB
            .getInvites("student@email.com", "student")
            .then((invites) => {
              return studentDB.acceptInvite(
                invites[0].id,
                "student-name",
                "student",
                "student@email.com",
                "Student"
              );
            }),
          tutorDB.getInvites("tutor@email.com", "tutor").then((invites) => {
            return tutorDB.acceptInvite(
              invites[0].id,
              "tutor-name",
              "tutor",
              "tutor@email.com",
              "Tutor"
            );
          }),
        ]);
      })
      .then(async () => {
        return headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.createQuiz(classes[0].id, "quizname");
          });
      });

    const questionObj = {
      id: "id",
      question: "question",
      A: "A",
      B: "B",
      C: "C",
      D: "D",
      answer: "answer",
      responses: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        total: 0,
      },
    };

    return Promise.all([
      assertSucceeds(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.createQuestion(
              classes[0].id,
              "quizname",
              1,
              questionObj
            );
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.createQuestion(
            classes[0].id,
            "quizname",
            2,
            questionObj
          );
        })
      ),
      assertFails(
        studentDB.getClasses("student-name", "student").then((classes) => {
          return studentDB.createQuestion(
            classes[0].id,
            "quizname",
            3,
            questionObj
          );
        })
      ),
    ]);
  });

  it("allow all users to read questions", async () => {
    const headTutorFirestore = testEnv
      .authenticatedContext("head-tutor-name")
      .firestore();
    const headTutorDB = getDatabase(headTutorFirestore);
    const studentFirestore = testEnv
      .authenticatedContext("student-name", { email: "student@email.com" })
      .firestore();
    const studentDB = getDatabase(studentFirestore);
    const tutorFirestore = testEnv
      .authenticatedContext("tutor-name", { email: "tutor@email.com" })
      .firestore();
    const tutorDB = getDatabase(tutorFirestore);

    await headTutorDB
      .createClass(
        "classname",
        {
          name: "Head Tutor",
          id: "head-tutor-name",
          email: "head-tutor@email.com",
        },
        ["student@email.com"],
        ["tutor@email.com"]
      )
      .then(() => {
        return Promise.all([
          studentDB
            .getInvites("student@email.com", "student")
            .then((invites) => {
              return studentDB.acceptInvite(
                invites[0].id,
                "student-name",
                "student",
                "student@email.com",
                "Student"
              );
            }),
          tutorDB.getInvites("tutor@email.com", "tutor").then((invites) => {
            return tutorDB.acceptInvite(
              invites[0].id,
              "tutor-name",
              "tutor",
              "tutor@email.com",
              "Tutor"
            );
          }),
        ]);
      })
      .then(async () => {
        return headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then(async (classes) => {
            return headTutorDB
              .createQuiz(classes[0].id, "quizname")
              .then(() => {
                const questionObj = {
                  id: "id",
                  question: "question",
                  A: "A",
                  B: "B",
                  C: "C",
                  D: "D",
                  answer: "answer",
                  responses: {
                    A: 0,
                    B: 0,
                    C: 0,
                    D: 0,
                    total: 0,
                  },
                };
                return headTutorDB.createQuestion(
                  classes[0].id,
                  "quizname",
                  1,
                  questionObj
                );
              });
          });
      });

    return Promise.all([
      assertSucceeds(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.pullQuizList(classes[0].id, () => {});
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.pullQuizList(classes[0].id, () => {});
        })
      ),
      assertSucceeds(
        studentDB.getClasses("student-name", "student").then((classes) => {
          return studentDB.pullQuizList(classes[0].id, () => {});
        })
      ),
    ]);
  });

  it("allow all users to update questions", async () => {
    const headTutorFirestore = testEnv
      .authenticatedContext("head-tutor-name")
      .firestore();
    const headTutorDB = getDatabase(headTutorFirestore);
    const studentFirestore = testEnv
      .authenticatedContext("student-name", { email: "student@email.com" })
      .firestore();
    const studentDB = getDatabase(studentFirestore);
    const tutorFirestore = testEnv
      .authenticatedContext("tutor-name", { email: "tutor@email.com" })
      .firestore();
    const tutorDB = getDatabase(tutorFirestore);

    await headTutorDB
      .createClass(
        "classname",
        {
          name: "Head Tutor",
          id: "head-tutor-name",
          email: "head-tutor@email.com",
        },
        ["student@email.com"],
        ["tutor@email.com"]
      )
      .then(() => {
        return Promise.all([
          studentDB
            .getInvites("student@email.com", "student")
            .then((invites) => {
              return studentDB.acceptInvite(
                invites[0].id,
                "student-name",
                "student",
                "student@email.com",
                "Student"
              );
            }),
          tutorDB.getInvites("tutor@email.com", "tutor").then((invites) => {
            return tutorDB.acceptInvite(
              invites[0].id,
              "tutor-name",
              "tutor",
              "tutor@email.com",
              "Tutor"
            );
          }),
        ]);
      })
      .then(async () => {
        return headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then(async (classes) => {
            return headTutorDB
              .createQuiz(classes[0].id, "quizname")
              .then(() => {
                const questionObj = {
                  id: "id",
                  question: "question",
                  A: "A",
                  B: "B",
                  C: "C",
                  D: "D",
                  answer: "answer",
                  responses: {
                    A: 0,
                    B: 0,
                    C: 0,
                    D: 0,
                    total: 0,
                  },
                };
                return headTutorDB.createQuestion(
                  classes[0].id,
                  "quizname",
                  1,
                  questionObj
                );
              });
          });
      });

    return Promise.all([
      assertSucceeds(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.submitAnswer(classes[0].id, "quizname", 0, "A");
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.submitAnswer(classes[0].id, "quizname", 0, "B");
        })
      ),
      assertSucceeds(
        studentDB.getClasses("student-name", "student").then((classes) => {
          return studentDB.submitAnswer(classes[0].id, "quizname", 0, "C");
        })
      ),
    ]);
  });

  it("should not allow invalid question creation", async () => {
    const headTutorFirestore = testEnv
      .authenticatedContext("head-tutor-name")
      .firestore();
    const headTutorDB = getDatabase(headTutorFirestore);
    const studentFirestore = testEnv
      .authenticatedContext("student-name", { email: "student@email.com" })
      .firestore();
    const studentDB = getDatabase(studentFirestore);
    const tutorFirestore = testEnv
      .authenticatedContext("tutor-name", { email: "tutor@email.com" })
      .firestore();
    const tutorDB = getDatabase(tutorFirestore);

    await headTutorDB
      .createClass(
        "classname",
        {
          name: "Head Tutor",
          id: "head-tutor-name",
          email: "head-tutor@email.com",
        },
        ["student@email.com"],
        ["tutor@email.com"]
      )
      .then(() => {
        return Promise.all([
          studentDB
            .getInvites("student@email.com", "student")
            .then((invites) => {
              return studentDB.acceptInvite(
                invites[0].id,
                "student-name",
                "student",
                "student@email.com",
                "Student"
              );
            }),
          tutorDB.getInvites("tutor@email.com", "tutor").then((invites) => {
            return tutorDB.acceptInvite(
              invites[0].id,
              "tutor-name",
              "tutor",
              "tutor@email.com",
              "Tutor"
            );
          }),
        ]);
      })
      .then(async () => {
        return headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.createQuiz(classes[0].id, "quizname");
          });
      });

    const questionObj = {
      id: "id",
      question: "question",
      A: "A",
      B: "B",
      C: "C",
      D: "D",
      answer: "answer",
      responses: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        total: 0,
        extrafield: "should not be allowed",
      },
    };

    return Promise.all([
      assertFails(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.createQuestion(
              classes[0].id,
              "quizname",
              1,
              questionObj
            );
          })
      ),
      assertFails(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.createQuestion(
            classes[0].id,
            "quizname",
            2,
            questionObj
          );
        })
      ),
      assertFails(
        studentDB.getClasses("student-name", "student").then((classes) => {
          return studentDB.createQuestion(
            classes[0].id,
            "quizname",
            3,
            questionObj
          );
        })
      ),
    ]);
  });

  it("should not allow invalid question update", async () => {
    const headTutorFirestore = testEnv
      .authenticatedContext("head-tutor-name")
      .firestore();
    const headTutorDB = getDatabase(headTutorFirestore);
    const studentFirestore = testEnv
      .authenticatedContext("student-name", { email: "student@email.com" })
      .firestore();
    const studentDB = getDatabase(studentFirestore);
    const tutorFirestore = testEnv
      .authenticatedContext("tutor-name", { email: "tutor@email.com" })
      .firestore();
    const tutorDB = getDatabase(tutorFirestore);

    await headTutorDB
      .createClass(
        "classname",
        {
          name: "Head Tutor",
          id: "head-tutor-name",
          email: "head-tutor@email.com",
        },
        ["student@email.com"],
        ["tutor@email.com"]
      )
      .then(() => {
        return Promise.all([
          studentDB
            .getInvites("student@email.com", "student")
            .then((invites) => {
              return studentDB.acceptInvite(
                invites[0].id,
                "student-name",
                "student",
                "student@email.com",
                "Student"
              );
            }),
          tutorDB.getInvites("tutor@email.com", "tutor").then((invites) => {
            return tutorDB.acceptInvite(
              invites[0].id,
              "tutor-name",
              "tutor",
              "tutor@email.com",
              "Tutor"
            );
          }),
        ]);
      })
      .then(async () => {
        return headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB
              .createQuiz(classes[0].id, "quizname")
              .then(() => {
                const questionObj = {
                  id: "id",
                  question: "question",
                  A: "A",
                  B: "B",
                  C: "C",
                  D: "D",
                  answer: "answer",
                  responses: {
                    A: 0,
                    B: 0,
                    C: 0,
                    D: 0,
                    total: 0,
                  },
                };
                return headTutorDB.createQuestion(
                  classes[0].id,
                  "quizname",
                  1,
                  questionObj
                );
              });
          });
      });

    return Promise.all([
      assertFails(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.invalidQuestionUpdate(
              classes[0].id,
              "quizname",
              1
            );
          })
      ),
      assertFails(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.invalidQuestionUpdate(classes[0].id, "quizname", 1);
        })
      ),
      assertFails(
        studentDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return studentDB.invalidQuestionUpdate(
              classes[0].id,
              "quizname",
              1
            );
          })
      ),
    ]);
  });

  it("should not allow question deletion", async () => {
    const headTutorFirestore = testEnv
      .authenticatedContext("head-tutor-name")
      .firestore();
    const headTutorDB = getDatabase(headTutorFirestore);
    const studentFirestore = testEnv
      .authenticatedContext("student-name", { email: "student@email.com" })
      .firestore();
    const studentDB = getDatabase(studentFirestore);
    const tutorFirestore = testEnv
      .authenticatedContext("tutor-name", { email: "tutor@email.com" })
      .firestore();
    const tutorDB = getDatabase(tutorFirestore);

    await headTutorDB
      .createClass(
        "classname",
        {
          name: "Head Tutor",
          id: "head-tutor-name",
          email: "head-tutor@email.com",
        },
        ["student@email.com"],
        ["tutor@email.com"]
      )
      .then(() => {
        return Promise.all([
          studentDB
            .getInvites("student@email.com", "student")
            .then((invites) => {
              return studentDB.acceptInvite(
                invites[0].id,
                "student-name",
                "student",
                "student@email.com",
                "Student"
              );
            }),
          tutorDB.getInvites("tutor@email.com", "tutor").then((invites) => {
            return tutorDB.acceptInvite(
              invites[0].id,
              "tutor-name",
              "tutor",
              "tutor@email.com",
              "Tutor"
            );
          }),
        ]);
      })
      .then(async () => {
        return headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then(async (classes) => {
            return headTutorDB
              .createQuiz(classes[0].id, "quizname")
              .then(() => {
                const questionObj = (id) => {
                  return {
                    id: id,
                    question: "question",
                    A: "A",
                    B: "B",
                    C: "C",
                    D: "D",
                    answer: "answer",
                    responses: {
                      A: 0,
                      B: 0,
                      C: 0,
                      D: 0,
                      total: 0,
                    },
                  };
                };
                return Promise.all([
                  headTutorDB.createQuestion(
                    classes[0].id,
                    "quizname",
                    1,
                    questionObj(1)
                  ),
                  headTutorDB.createQuestion(
                    classes[0].id,
                    "quizname",
                    2,
                    questionObj(2)
                  ),
                  headTutorDB.createQuestion(
                    classes[0].id,
                    "quizname",
                    3,
                    questionObj(3)
                  ),
                ]);
              });
          });
      });

    return Promise.all([
      assertFails(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.deleteQuestion(classes[0].id, "quizname", 1);
          })
      ),
      assertFails(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.deleteQuestion(classes[0].id, "quizname", 2);
        })
      ),
      assertFails(
        studentDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return studentDB.deleteQuestion(classes[0].id, "quizname", 3);
          })
      ),
    ]);
  });
});
