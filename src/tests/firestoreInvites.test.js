/**
 * Make sure all async functions complete within each test case
 * to avoid errors "spilling over" to other test cases.
 */

const { readFileSync, createWriteStream } = require('fs');
const http = require("http");
const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const { setLogLevel, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const getDatabase = require("../database").default;

let testEnv;

beforeAll(async () => {
  // Silence expected rules rejections from Firestore SDK.
  setLogLevel('error');

  testEnv = await initializeTestEnvironment({
    projectId: "test-invites-1234",
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

describe("Class invitation", () => {
  it('should let head tutors invite students', async () => {
    const aliceFirestore = testEnv.authenticatedContext('alice').firestore();
    const db = getDatabase(aliceFirestore);
    const classSnapshot = await db.createClass("CS1234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["student@email.com"],
      []
    );

    return await assertSucceeds(db.addInvites(
      classSnapshot.id, ["student2@email.com"], "student")
    );
  });

  it("should let users see invites to enroll", async () => {
    /**
     *  If rules are written correctly, firebase throws a "Evaluation error"
     *  when one tries to retrieve invites for other emails
     */
    const bobFirestore = testEnv.authenticatedContext('bob').firestore();
    const bobDb = getDatabase(bobFirestore);
    await bobDb.createClass("CS5656",
      {
        name: "bobby lim",
        id: "bob",
        email: "bob@email.com"
      },
      ["charlie@email.com"],
      ["tutor@email.com"]
    ).then(async () => {
      const charlieFirestore = testEnv.authenticatedContext('charlie', { email: "charlie@email.com" }).firestore();
      const charlieDb = getDatabase(charlieFirestore);
      const invites = await charlieDb.getInvites("charlie@email.com", "student");
      expect(invites.length).toBe(1);
      expect(invites[0].className).toBe("CS5656");
    });
  });

  it("should let users see invites to teach", async () => {
    /**
     *  If rules are written correctly, firebase throws a "Evaluation error"
     *  when one tries to retrieve invites for other emails
     */
    const bobFirestore = testEnv.authenticatedContext('bob').firestore();
    const bobDb = getDatabase(bobFirestore);
    await bobDb.createClass("CS1526",
      {
        name: "bobby lim",
        id: "bob",
        email: "bob@email.com"
      },
      ["charlie@email.com"],
      ["denny@email.com", "ella@gmail.com"]
    ).then(async () => {
      const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
      const dennyDb = getDatabase(dennyFirestore);
      const invites = await dennyDb.getInvites("denny@email.com", "tutor");
      expect(invites.length).toBe(1);
      expect(invites[0].className).toBe("CS1526");
    });
  });

  it("should not let users see other users' invites", async () => {
    const bobFirestore = testEnv.authenticatedContext('bob').firestore();
    const bobDb = getDatabase(bobFirestore);
    await bobDb.createClass("CS1260",
      {
        name: "bobby lim",
        id: "bob",
        email: "bob@email.com"
      },
      ["charlie@email.com"],
      ["denny@email.com", "ella@gmail.com"]
    ).then(async () => {
      const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
      const dennyDb = getDatabase(dennyFirestore);
      return await assertFails(dennyDb.getInvites("ella@gmail.com", "tutor"));
    });
  });

  it('should let users delete student invites', async () => {
    const aliceFirestore = testEnv.authenticatedContext('alice').firestore();
    const aliceDb = getDatabase(aliceFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);

    return aliceDb.createClass("CS1234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["denny@email.com"],
      []
    ).then(() => {
      return dennyDb.getInvites("denny@email.com", "student");
    }).then((invites) => {
      return dennyDb.deleteInvite(invites[0].id, "student", "denny@email.com");
    }).then(() => {
      return dennyDb.getInvites("denny@email.com", "student");
    }).then((invites) => {
      expect(invites.length).toBe(0);
    });
  });

  it('should let users delete tutor invites', async () => {
    const aliceFirestore = testEnv.authenticatedContext('alice').firestore();
    const aliceDb = getDatabase(aliceFirestore);
    const ginaFirestore = testEnv.authenticatedContext('gina', { email: "gina@gmail.com" }).firestore();
    const ginaDb = getDatabase(ginaFirestore);

    return aliceDb.createClass("CS1234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["denny@email.com"],
      ["gina@gmail.com"]
    ).then(() => {
      return ginaDb.getInvites("gina@gmail.com", "tutor");
    }).then((invites) => {
      return ginaDb.deleteInvite(invites[0].id, "tutor", "gina@gmail.com");
    }).then(() => {
      return ginaDb.getInvites("gina@gmail.com", "tutor");
    }).then((invites) => {
      expect(invites.length).toBe(0);
    });
  });

  it('should let users accept student invites', async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);

    return barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      []
    ).then(() => {
      return dennyDb.getInvites("denny@email.com", "student");
    }).then((invites) => {
      return dennyDb.acceptInvite(invites[0].id, 'denny', "student", "denny@email.com", "denny tan");
    }).then(() => {
      return Promise.all(
        [
          dennyDb.getInvites("denny@email.com", "student")
            .then((invites) => {
              expect(invites.length).toBe(0);
            }),
          dennyDb.getClasses("denny", "student")
            .then((classes) => {
              expect(classes.length).toBe(1);
              expect(classes[0].className).toBe("CS2134");
            })
        ]
      );
    });
  });

  it('should let users accept tutor invites', async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
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
    ).then(() => {
      return elvinDb.getInvites("elvin@gmail.com", "tutor");
    }).then((invites) => {
      return elvinDb.acceptInvite(invites[0].id, 'elvin', "tutor", "elvin@gmail.com", "elvin chan");
    }).then(() => {
      return Promise.all(
        [
          elvinDb.getInvites("elvin@gmail.com", "tutor")
            .then(async (invites) => {
              await expect(invites.length).toBe(0)
            }),
          elvinDb.getClasses("elvin", "tutor")
            .then(async (classes) => {
              await expect(classes.length).toBe(1);
              await expect(classes[0].className).toBe("CS2134");
            })
        ]
      );
    });
  });

  it('should not let users add student documents with invalid fields', async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);

    return barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      []
    ).then(() => {
      return dennyDb.getInvites("denny@email.com", "student");
    }).then(async (invites) => {
      const missingFields = await assertFails(setDoc(doc(dennyFirestore, "classes", invites[0].id, "students", "denny"), {
        id: "denny",
        email: "denny@email.com",
        name: "denny lee",
        level: 0,
        //missing exp
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
      }));

      const missingFields2 = await assertFails(setDoc(doc(dennyFirestore, "classes", invites[0].id, "students", "denny"), {
        id: "denny",
        email: "denny@email.com",
        name: "denny lee",
        level: 0,
        exp: 0,
        dailyCounts: {
          //missing posts
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
      }));

      const extraFields = await assertFails(setDoc(doc(dennyFirestore, "classes", invites[0].id, "students", "denny"), {
        id: "denny",
        email: "denny@email.com",
        name: "denny lee",
        extraRandomField: "This is not supposed to be one of the fields",
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
      }));

      const extraFields2 = await assertFails(setDoc(doc(dennyFirestore, "classes", invites[0].id, "students", "denny"), {
        id: "denny",
        email: "denny@email.com",
        name: "denny lee",
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
          additionalField: 0,
          quizCorrectAnswers: 0,
        }
      }));
      return Promise.all([missingFields, missingFields2, extraFields, extraFields2]);
    });
  });

  it('should not let users add tutors documents with invalid fields', async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);

    return barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      [],
      ["denny@email.com"]
    ).then(() => {
      return dennyDb.getInvites("denny@email.com", "tutor");
    }).then(async (invites) => {
      const missingFields = await assertFails(setDoc(doc(dennyFirestore, "classes", invites[0].id, "tutors", "denny"), {
        id: "denny",
        email: "denny@email.com",
        //missing name
      }));
      const extraFields = await assertFails(setDoc(doc(dennyFirestore, "classes", invites[0].id, "tutors", "denny"), {
        id: "denny",
        email: "denny@email.com",
        name: "danny lee",
        notAllowed: 'field'
      }));
 
      return Promise.all([missingFields, extraFields]);
    });
  });

  it('should let tutors invite students', async () => {
      const barryFirestore = testEnv.authenticatedContext('barry').firestore();
      const barryDb = getDatabase(barryFirestore);
      const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
      const elvinDb = getDatabase(elvinFirestore);
      const studentFirestore = testEnv.authenticatedContext('student', { email: "student@email.com" }).firestore();
      const studentDb = getDatabase(studentFirestore);

      return barryDb.createClass("CS3467",
        {
          name: "barry ong",
          id: "barry",
          email: "barryong@email.com"
        },
        [],
        ["elvin@gmail.com"]
      ).then(() => {
        return elvinDb.getInvites("elvin@gmail.com", "tutor");
      }).then((invites) => {
        return elvinDb.acceptInvite(invites[0].id, 'elvin', "tutor", "elvin@gmail.com", "elvin chan");
      }).then(() => {
        return elvinDb.getClasses("elvin", "tutor");
      }).then((classes) => {
        return elvinDb.addInvites(
          classes[0].id, ["student@email.com"], "student");
      }).then(() => {
        return studentDb.getInvites("student@email.com", "student");
      }).then((invites) => {
        expect(invites.length).toBe(1);
        expect(invites[0].className).toBe("CS3467")
      });
    });
  })