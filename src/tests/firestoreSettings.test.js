/**
 * Make sure all async functions complete within each test case
 * to avoid errors "spilling over" to other test cases.
 */

const { readFileSync, createWriteStream } = require('fs');
const http = require("http");
const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const { setLogLevel, getDoc, doc, setDoc } = require('firebase/firestore');
const getDatabase = require("../database").default;

let testEnv;

beforeAll(async () => {
  // Silence expected rules rejections from Firestore SDK.
  setLogLevel('error');

  testEnv = await initializeTestEnvironment({
    projectId: "test-settings-1234",
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

describe.only("Class settings", () => {
  it("should not let users see other classes' settings", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);

    return barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    ).then((snapshot) => {
      const randomAuthedFirestore = testEnv.authenticatedContext('rando').firestore();
      const settingsDocRef = doc(randomAuthedFirestore, "classes", snapshot.id, "settings", "levelling")
      return assertFails(getDoc(settingsDocRef));
    });
  });

  it("should let users see their class settings", async () => {
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
        assertSucceeds(barryDb.getLevellingSettings(snapshot.id)),
        dennyDb.getInvites("denny@email.com", "student")
          .then((invites) => {
            return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
          }).then(() => {
            return dennyDb.getClasses("denny", "student");
          }).then((classes) => {
            return assertSucceeds(dennyDb.getLevellingSettings(classes[0].id));
          }),
        elvinDb.getInvites("elvin@gmail.com", "tutor")
          .then((invites) => {
            return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
          }).then(() => {
            return elvinDb.getClasses("elvin", "tutor");
          }).then((classes) => {
            return assertSucceeds(elvinDb.getLevellingSettings(classes[0].id));
          })
      ])
    });
  });

  it("should let only head tutors and tutors change levelling settings", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const expRequirements = [];
    for (let i = 1; i < 101; i++) {
      expRequirements.push(12 * i * i);
    }
    const newSettings = {
      expRequirements: expRequirements,
      limits: {
        posts: 3,
        votes: 1,
        feedbacks: 1,
        quizzesAttended: 3,
        quizCorrectAnswers: 3
      },
      expGain: {
        posts: 50,
        votes: 10,
        feedbacks: 100,
        quizzesAttended: 50,
        quizCorrectAnswers: 10
      }
    };

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
        assertSucceeds(barryDb.changeLevellingSettings(snapshot.id, newSettings)),
        dennyDb.getInvites("denny@email.com", "student")
          .then((invites) => {
            return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
          }).then(() => {
            return dennyDb.getClasses("denny", "student");
          }).then((classes) => {
            return assertFails(dennyDb.changeLevellingSettings(classes[0].id, newSettings));
          }),
        elvinDb.getInvites("elvin@gmail.com", "tutor")
          .then((invites) => {
            return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
          }).then(() => {
            return elvinDb.getClasses("elvin", "tutor");
          }).then((classes) => {
            return assertSucceeds(elvinDb.changeLevellingSettings(classes[0].id, newSettings));
          })
      ])
    });
  });

  it.only("should let not let users change levelling settings with missing fields", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const expRequirements = [];
    for (let i = 1; i < 101; i++) {
      expRequirements.push(12 * i * i);
    }
    const newSettings = {
      expRequirements: expRequirements,
      limits: {
        posts: 3,
        votes: 1,
        feedbacks: 1,
        quizzesAttended: 3,
        quizCorrectAnswers: 3
      }
      // missing expGain
    };
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
        async function() {
          const barrySettingsRef = doc(barryFirestore, 'classes', snapshot.id, 'settings', 'levelling');
          return assertFails(setDoc(barrySettingsRef, newSettings));
        }(),
        elvinDb.getInvites("elvin@gmail.com", "tutor")
          .then((invites) => {
            return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
          }).then(() => {
            return elvinDb.getClasses("elvin", "tutor");
          }).then((classes) => {
            const elvinSettingsRef = doc(elvinFirestore, 'classes', classes[0].id, 'settings', 'levelling');
            return assertFails(setDoc(elvinSettingsRef, newSettings));
          })
      ])
    });
  });

  it("should let not let users change levelling settings with extra fields", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const expRequirements = [];
    for (let i = 1; i < 101; i++) {
      expRequirements.push(12 * i * i);
    }
    const newSettings = {
      expRequirements: expRequirements,
      limits: {
        posts: 3,
        additionalField: 3,
        votes: 1,
        feedbacks: 1,
        quizzesAttended: 3,
        quizCorrectAnswers: 3
      },
      expGain: {
        posts: 50,
        votes: 10,
        feedbacks: 100,
        quizzesAttended: 50,
        quizCorrectAnswers: 10
      }
    };
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
        assertFails(barryDb.changeLevellingSettings(snapshot.id, newSettings)),
        elvinDb.getInvites("elvin@gmail.com", "tutor")
          .then((invites) => {
            return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
          }).then(() => {
            return elvinDb.getClasses("elvin", "tutor");
          }).then((classes) => {
            return assertFails(elvinDb.changeLevellingSettings(classes[0].id, newSettings));
          })
      ])
    });
  });
})
