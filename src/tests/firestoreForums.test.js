/**
 * Make sure all async functions complete within each test case
 * to avoid errors "spilling over" to other test cases.
 */

const { readFileSync, createWriteStream } = require('fs');
const http = require("http");
const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const { setLogLevel } = require('firebase/firestore');
const getDatabase = require("../database").default;

let testEnv;

beforeAll(async () => {
  // Silence expected rules rejections from Firestore SDK.
  setLogLevel('error');

  testEnv = await initializeTestEnvironment({
    projectId: "test-forums-1234",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();

  // Write the coverage report to a file
  const coverageFile = 'firestore-coverage.html';
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    const { host, port } = testEnv.emulators.firestore;
    const quotedHost = host.includes(':') ? `[${host}]` : host;
    http.get(`http://${quotedHost}:${port}/emulator/v1/projects/${testEnv.projectId}:ruleCoverage.html`, (res) => {
      res.pipe(fstream, { end: true });

      res.on("end", resolve);
      res.on("error", reject);
    });
  });
});

beforeEach(async () => {
  return await testEnv.clearFirestore();
});

describe("Forums", () => {
  it("should let only head tutors and tutors add forum threads", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);

    return barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    ).then((snapshot) => {
      return Promise.all([
        assertSucceeds(barryDb.addForumThread(snapshot.id, "New Thread")),
        dennyDb.getInvites("denny@email.com", "student")
          .then((invites) => {
            return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
          }).then(() => {
            return dennyDb.getClasses("denny", "student");
          }).then((classes) => {
            return assertFails(dennyDb.addForumThread(classes[0].id, "Student threads"));
          }),
        elvinDb.getInvites("elvin@gmail.com", "tutor")
          .then((invites) => {
            return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
          }).then(() => {
            return elvinDb.getClasses("elvin", "tutor");
          }).then((classes) => {
            return assertSucceeds(elvinDb.addForumThread(classes[0].id, "Another Thread"));
          })
      ])
    });
  });

  it("should not let other users view forum threads", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser').firestore();
    const otherDb = getDatabase(otherFirestore);

    const snapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );

    return barryDb.addForumThread(snapshot.id, "New General Class Thread")
      .then(() => {
        return assertFails(otherDb.getForumThreads(snapshot.id));
      });
  });

  it("should let users view forum threads", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);

    return barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    ).then((snapshot) => {
      return barryDb.addForumThread(snapshot.id, "New General Class Thread");
    }).then(() => {
      return Promise.all([
        barryDb.getClasses("barry", "head tutor")
          .then((classes) => {
            return barryDb.getForumThreads(classes[0].id);
          }),
        dennyDb.getInvites("denny@email.com", "student")
          .then((invites) => {
            return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
          }).then(() => {
            return dennyDb.getClasses("denny", "student");
          }).then((classes) => {
            return dennyDb.getForumThreads(classes[0].id);
          }),
        elvinDb.getInvites("elvin@gmail.com", "tutor")
          .then((invites) => {
            return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
          }).then(() => {
            return elvinDb.getClasses("elvin", "tutor");
          }).then((classes) => {
            return elvinDb.getForumThreads(classes[0].id);
          })
      ]).then((promises) => {
        promises.forEach((threads) => {
          expect(threads[0].name).toBe("New General Class Thread");
        });
      });
    });
  });

  it("should let users create forum posts", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);

    const snapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );

    return barryDb.addForumThread(snapshot.id, "New General Class Thread")
      .then(() => {
        return Promise.all([
          barryDb.getClasses("barry", "head tutor")
            .then((classes) => {
              return barryDb.getForumThreads(classes[0].id);
            }).then((threads) => {
              return barryDb.addForumPost(snapshot.id, threads[0].id, "barry's post", "hi everyone", "barry")
            }),
          dennyDb.getInvites("denny@email.com", "student")
            .then((invites) => {
              return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
            }).then(() => {
              return dennyDb.getClasses("denny", "student");
            }).then((classes) => {
              return dennyDb.getForumThreads(classes[0].id);
            }).then((threads) => {
              return dennyDb.addForumPost(snapshot.id, threads[0].id, "denny's post", "hi everyone!", "denny")
            }),
          elvinDb.getInvites("elvin@gmail.com", "tutor")
            .then((invites) => {
              return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
            }).then(() => {
              return elvinDb.getClasses("elvin", "tutor");
            }).then((classes) => {
              return elvinDb.getForumThreads(classes[0].id);
            }).then((threads) => { 
              return elvinDb.addForumPost(snapshot.id, threads[0].id, "elvin's post", "hi everyone!!", "elvin")
            })
        ]);
      });
  });
})
