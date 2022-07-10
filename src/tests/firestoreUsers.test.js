/**
 * Make sure all async functions complete within each test case
 * to avoid errors "spilling over" to other test cases.
 */

const { readFileSync, createWriteStream } = require('fs');
const http = require("http");
const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const { setLogLevel, collection, getDocs } = require('firebase/firestore');
const getDatabase = require("../database").default;

let testEnv;

beforeAll(async () => {
  // Silence expected rules rejections from Firestore SDK.
  setLogLevel('error');

  testEnv = await initializeTestEnvironment({
    projectId: "test-users-1234",
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

describe("Class students", () => {
  it("should not let users see other classes' students", async () => {
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
      const studentsRef = collection(randomAuthedFirestore, "classes", snapshot.id, "students")
      return assertFails(getDocs(studentsRef));
    });
  });

  it("should let head tutors see specific students of their class", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', {email: "denny@email.com"}).firestore();
    const dennyDb = getDatabase(dennyFirestore);

    const snapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );

    return dennyDb.getInvites("denny@email.com", "student")
      .then((invites) => {
        return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "Denny Lim");
      }).then(() => {
        return barryDb.getUser(snapshot.id, "students", "denny");
      }).then((user) => {
        expect(user.name).toBe("Denny Lim");
      });
  });
})

describe("Class tutors", () => {
  it("should not let users see other classes' tutors", async () => {
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
      const tutorsRef = collection(randomAuthedFirestore, "classes", snapshot.id, "tutors")
      return assertFails(getDocs(tutorsRef));
    });
  });

  it("should let head tutors see specific tutors of their class", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', {email: "elvin@gmail.com"}).firestore();
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

    return elvinDb.getInvites("elvin@gmail.com", "tutor")
      .then((invites) => {
        return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "Elvin Lee");
      }).then(() => {
        return elvinDb.getUser(snapshot.id, "tutors", "elvin");
      }).then((user) => {
        expect(user.name).toBe("Elvin Lee");
      });
  });
})