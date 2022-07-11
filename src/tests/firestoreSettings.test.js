/**
 * Make sure all async functions complete within each test case
 * to avoid errors "spilling over" to other test cases.
 */

const { readFileSync, createWriteStream } = require('fs');
const http = require("http");
const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const { setLogLevel, getDoc, doc } = require('firebase/firestore');
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

describe("Class settings", () => {
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
    const dennyFirestore = testEnv.authenticatedContext('denny', {email: "denny@email.com"}).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', {email: "elvin@gmail.com"}).firestore();
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
})
