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
    projectId: "test-quiz-1234",
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

describe("Quiz", () => {
  it("should only allow head tutors and tutors to create quiz", async () => {
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
      });
    return Promise.all([
      assertSucceeds(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.createQuiz(classes[0].id, "quiz1");
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.createQuiz(classes[0].id, "quiz2");
        })
      ),
      assertFails(
        studentDB.getClasses("student-name", "student").then((classes) => {
          return studentDB.createQuiz(classes[0].id, "quiz3");
        })
      ),
    ]);
  });

  it("should only allow head tutors and tutors to delete quiz", async () => {
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
      });
    return Promise.all([
      assertSucceeds(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.deleteQuiz(classes[0].id, "quiz1");
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.deleteQuiz(classes[0].id, "quiz2");
        })
      ),
      assertFails(
        studentDB.getClasses("student-name", "student").then((classes) => {
          return studentDB.deleteQuiz(classes[0].id, "quiz3");
        })
      ),
    ]);
  });

  it("should only allow head tutors and tutors to update quiz", async () => {
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
      });
    return Promise.all([
      assertSucceeds(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then(async (classes) => {
            return headTutorDB.createQuiz(classes[0].id, "quiz1").then(() => {
              return headTutorDB.toggleRevision(classes[0].id, "quiz1", true);
            });
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then(async (classes) => {
          return tutorDB.createQuiz(classes[0].id, "quiz2").then(() => {
            return tutorDB.toggleRevision(classes[0].id, "quiz2", true);
          });
        })
      ),
      assertFails(
        studentDB
          .getClasses("student-name", "student")
          .then(async (classes) => {
            return studentDB.toggleRevision(classes[0].id, "quiz2", true);
          })
      ),
    ]);
  });

  it("should allow all users in class to read quiz", async () => {
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
      });

    return headTutorDB
      .getClasses("head-tutor-name", "head tutor")
      .then(async (classes) => {
        return headTutorDB.createQuiz(classes[0].id, "quizname").then(() => {
          return Promise.all([
            assertSucceeds(headTutorDB.readQuiz(classes[0].id, "quizname")),
            assertSucceeds(tutorDB.readQuiz(classes[0].id, "quizname")),
            assertSucceeds(studentDB.readQuiz(classes[0].id, "quizname")),
          ]);
        });
      });
  });

  it("should not allow invalid quiz creation (with extra fields)", async () => {
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
      });

    return Promise.all([
      assertFails(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            return headTutorDB.createInvalidQuiz(classes[0].id, "quiz1");
          })
      ),
      assertFails(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.createInvalidQuiz(classes[0].id, "quiz2");
        })
      ),
    ]);
  });

  it("should not allow invalid quiz update (with extra fields)", async () => {
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
      });

    return Promise.all([
      assertFails(
        headTutorDB
          .getClasses("head-tutor-name", "head tutor")
          .then((classes) => {
            headTutorDB.createQuiz(classes[0].id, "quiz1");
            return headTutorDB.invalidQuizUpdate(classes[0].id, "quiz1");
          })
      ),
      assertFails(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          tutorDB.createQuiz(classes[0].id, "quiz2");
          return tutorDB.invalidQuizUpdate(classes[0].id, "quiz2");
        })
      ),
    ]);
  });
});
