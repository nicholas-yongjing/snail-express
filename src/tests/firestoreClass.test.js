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
    projectId: "test-classes-1234",
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

describe('Class creation', () => {
  it('should not let unauthenticated users add class', async () => {
    const unauthedFirestore = testEnv.unauthenticatedContext().firestore();
    const db = getDatabase(unauthedFirestore);
    return await assertFails(db.createClass("CS1234",
      {
        name: "unknown user",
        id: 123,
        email: "unknown@email.com"
      },
      ["student@email.com"],
      []
    ));
  });

  it('should not let users add class with someone else as head tutor', async () => {
    const aliceFirestore = testEnv.authenticatedContext('alice').firestore();
    const db = getDatabase(aliceFirestore);
    return await assertFails(db.createClass("CS1234",
      {
        name: "bob",
        id: "bob",
        email: "alicetan@email.com"
      },
      ["student@email.com"],
      []
    ));
  });

  it('should not let users add class with missing fields', async () => {
    const bobFirestore = testEnv.authenticatedContext('bob').firestore();
    const db = getDatabase(bobFirestore);
    return await assertFails(db.createClass("CS1234",
      {
        name: "bob",
        id: "bob",
        //missing email
      },
      ["student@email.com"],
      []
    ));
  });

  it('should not let users add class with extra fields', async () => {
    const bobFirestore = testEnv.authenticatedContext('bob').firestore();
    const db = getDatabase(bobFirestore);
    return await assertFails(db.createClass("CS1234",
      {
        name: "bob",
        id: "bob",
        email: "bob@email.com",
        extraField: "this field should not be allowed"
      },
      ["student@email.com"],
      []
    ));
  });

  it('should let authenticated users add class with themselves as head tutor', async () => {
    const aliceFirestore = testEnv.authenticatedContext('alice').firestore();
    const db = getDatabase(aliceFirestore);
    return await assertSucceeds(db.createClass("CS1234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["student@email.com"],
      []
    ));
  });

  it('should let users add multiple classes', async () => {
    const aliceFirestore = testEnv.authenticatedContext('alice').firestore();
    const db = getDatabase(aliceFirestore);
    const class1 = await assertSucceeds(db.createClass("CS1234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["student@email.com"],
      []
    ));
    const class2 = await assertSucceeds(db.createClass("CS2234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["student2@email.com", "student3@email.com"],
      ["tutor@email.com"]
    ));
    return await Promise.all([class1, class2]);
  });

  it("should let users retrieve created class", async () => {
    const aliceFirestore = testEnv.authenticatedContext('alice').firestore();
    const db = getDatabase(aliceFirestore);
    return db.createClass("MA2234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["bob@email.com"],
      []
    ).then(async () => {
      const classes = await db.getClasses("alice", "head tutor");
      expect(classes.length).toBe(1);
      expect(classes[0].className).toBe("MA2234");
    });
  })

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
})
