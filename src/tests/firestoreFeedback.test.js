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
    projectId: "test-feedback-1234",
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

describe("Feedback", () => {
  it("should allow all users to update entries", async () => {
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
            return headTutorDB
              .setLectureFeedback(
                classes[0].id,
                { uid: "some-name", displayName: "name1" },
                "angry"
              )
              .then(() => {
                return headTutorDB.updateLectureFeedback(
                  classes[0].id,
                  { uid: "some-name", displayName: "name1" },
                  "more-angry"
                );
              });
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then(async (classes) => {
          return tutorDB
            .setLectureFeedback(
              classes[0].id,
              { uid: "another-name", displayName: "name2" },
              "happy"
            )
            .then(() => {
              return headTutorDB.updateLectureFeedback(
                classes[0].id,
                { uid: "another-name", displayName: "name2" },
                "more-happy"
              );
            });
        })
      ),
      assertSucceeds(
        studentDB
          .getClasses("student-name", "student")
          .then(async (classes) => {
            return studentDB
              .setLectureFeedback(
                classes[0].id,
                { uid: "random-name", displayName: "name3" },
                "sad"
              )
              .then(() => {
                return headTutorDB.updateLectureFeedback(
                  classes[0].id,
                  { uid: "random-name", displayName: "name3" },
                  "more-sad"
                );
              });
          })
      ),
    ]);
  });

  it("should allow all users to create entries", async () => {
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
            return headTutorDB.setLectureFeedback(
              classes[0].id,
              { uid: "some-name", displayName: "name1" },
              "angry"
            );
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then((classes) => {
          return tutorDB.setLectureFeedback(
            classes[0].id,
            { uid: "another-name", displayName: "name2" },
            "happy"
          );
        })
      ),
      assertSucceeds(
        studentDB.getClasses("student-name", "student").then((classes) => {
          return studentDB.setLectureFeedback(
            classes[0].id,
            { uid: "random-name", displayName: "name3" },
            "sad"
          );
        })
      ),
    ]);
  });

  it("should allow all users to read entries", async () => {
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
            return headTutorDB
              .setLectureFeedback(
                classes[0].id,
                { uid: "some-name", displayName: "name1" },
                "angry"
              )
              .then(() => {
                return headTutorDB.fetchLectureFeedback(classes[0].id, {
                  uid: "some-name",
                  displayName: "name1",
                });
              });
          })
      ),
      assertSucceeds(
        tutorDB.getClasses("tutor-name", "tutor").then(async (classes) => {
          return tutorDB
            .setLectureFeedback(
              classes[0].id,
              { uid: "another-name", displayName: "name2" },
              "happy"
            )
            .then(() => {
              return tutorDB.fetchLectureFeedback(classes[0].id, {
                uid: "another-name",
                displayName: "name2",
              });
            });
        })
      ),
      assertSucceeds(
        studentDB
          .getClasses("student-name", "student")
          .then(async (classes) => {
            return studentDB
              .setLectureFeedback(
                classes[0].id,
                { uid: "random-name", displayName: "name3" },
                "sad"
              )
              .then(() => {
                return studentDB.fetchLectureFeedback(classes[0].id, {
                  uid: "random-name",
                  displayName: "name3",
                });
              });
          })
      ),
    ]);
  });

//   it("should only allow the head tutor to delete (reset) entries", async () => {
//     const headTutorFirestore = testEnv
//       .authenticatedContext("head-tutor-name")
//       .firestore();
//     const headTutorDB = getDatabase(headTutorFirestore);
//     const studentFirestore = testEnv
//       .authenticatedContext("student-name", { email: "student@email.com" })
//       .firestore();
//     const studentDB = getDatabase(studentFirestore);
//     const tutorFirestore = testEnv
//       .authenticatedContext("tutor-name", { email: "tutor@email.com" })
//       .firestore();
//     const tutorDB = getDatabase(tutorFirestore);

//     await headTutorDB
//       .createClass(
//         "classname",
//         {
//           name: "Head Tutor",
//           id: "head-tutor-name",
//           email: "head-tutor@email.com",
//         },
//         ["student@email.com"],
//         ["tutor@email.com"]
//       )
//       .then(() => {
//         return Promise.all([
//           studentDB
//             .getInvites("student@email.com", "student")
//             .then((invites) => {
//               return studentDB.acceptInvite(
//                 invites[0].id,
//                 "student-name",
//                 "student",
//                 "student@email.com",
//                 "Student"
//               );
//             }),
//           tutorDB.getInvites("tutor@email.com", "tutor").then((invites) => {
//             return tutorDB.acceptInvite(
//               invites[0].id,
//               "tutor-name",
//               "tutor",
//               "tutor@email.com",
//               "Tutor"
//             );
//           }),
//         ]);
//       });

//     return Promise.all([
//       assertSucceeds(
//         headTutorDB
//           .getClasses("head-tutor-name", "head tutor")
//           .then(async (classes) => {
//             return headTutorDB
//               .setLectureFeedback(
//                 classes[0].id,
//                 { uid: "some-name", displayName: "name1" },
//                 "angry"
//               )
//               .then(() => {
//                 return headTutorDB.resetLectureFeedbacks(classes[0].id);
//               });
//           })
//       ),
//       assertFails(
//         tutorDB.getClasses("tutor-name", "tutor").then(async (classes) => {
//           return tutorDB
//             .setLectureFeedback(
//               classes[0].id,
//               { uid: "another-name", displayName: "name2" },
//               "happy"
//             )
//             .then(() => {
//               return tutorDB.resetLectureFeedbacks(classes[0].id);
//             });
//         })
//       ),
//       assertFails(
//         studentDB
//           .getClasses("student-name", "student")
//           .then(async (classes) => {
//             return studentDB
//               .setLectureFeedback(
//                 classes[0].id,
//                 { uid: "random-name", displayName: "name3" },
//                 "sad"
//               )
//               .then(() => {
//                 return studentDB.resetLectureFeedbacks(classes[0].id);
//               });
//           })
//       ),
//     ]);
//   });
});
