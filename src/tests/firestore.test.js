/**
 * To run the tests, enter into the terminal:
 * firebase emulators:exec --only firestore "npm run test"
 * 
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
    projectId: "demo-project-1234",
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
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const firestore = getDatabase(unauthedDb);
    return await assertFails(firestore.createClass("CS1234",
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
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const firestore = getDatabase(aliceDb);
    return await assertFails(firestore.createClass("CS1234",
      {
        name: "bob",
        id: "bob",
        email: "alicetan@email.com"
      },
      ["student@email.com"],
      []
    ));
  });

  it('should let authenticated users add class with themselves as head tutor', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const firestore = getDatabase(aliceDb);
    return await assertSucceeds(firestore.createClass("CS1234",
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
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const firestore = getDatabase(aliceDb);
    const class1 = await assertSucceeds(firestore.createClass("CS1234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["student@email.com"],
      []
    ));
    const class2 = await assertSucceeds(firestore.createClass("CS2234",
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
});

describe("Class invitation", () => {
  it('should let head tutors invite students', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const firestore = getDatabase(aliceDb);
    const classSnapshot = await firestore.createClass("CS1234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["student@email.com"],
      []
    );

    return await assertSucceeds(firestore.addInvites(
      classSnapshot.id, [], "student")
    );
  });

  it("should let users retrieve created class", async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const firestore = getDatabase(aliceDb);
    return firestore.createClass("MA2234",
      {
        name: "alice tan",
        id: "alice",
        email: "alicetan@email.com"
      },
      ["bob@email.com"],
      []
    ).then(async () => {
      const classes = await firestore.getClasses("alice", "head tutor");
      expect(classes.length).toBe(1);
      expect(classes[0].className).toBe("MA2234");
    });
  })

  it("should let users see invites to enroll", async () => {
    /**
     *  If rules are written correctly, firebase throws a "Evaluation error"
     *  when one tries to retrieve invites for other emails
     */
    const bobFirestore = testEnv.authenticatedContext('bob').firestore();
    const bobDatabase = getDatabase(bobFirestore);
    await bobDatabase.createClass("CS5656",
      {
        name: "bobby lim",
        id: "bob",
        email: "bob@email.com"
      },
      ["charlie@email.com"],
      ["tutor@email.com"]
    ).then(async () => {
      const charlieFirestore = testEnv.authenticatedContext('charlie', {email: "charlie@email.com"}).firestore();
      const charlieDatabase = getDatabase(charlieFirestore);
      const invites = await charlieDatabase.getInvites("charlie@email.com", "student");
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
    const bobDatabase = getDatabase(bobFirestore);
    await bobDatabase.createClass("CS1526",
      {
        name: "bobby lim",
        id: "bob",
        email: "bob@email.com"
      },
      ["charlie@email.com"],
      ["denny@email.com", "ella@gmail.com"]
    ).then(async () => {
      const dennyFirestore = testEnv.authenticatedContext('denny', {email: "denny@email.com"}).firestore();
      const dennyDatabase = getDatabase(dennyFirestore);
      const invites = await dennyDatabase.getInvites("denny@email.com", "tutor");
      expect(invites.length).toBe(1);
      expect(invites[0].className).toBe("CS1526");
    });
  });

  it("should not let users see other users' invites", async () => {
    const bobFirestore = testEnv.authenticatedContext('bob').firestore();
    const bobDatabase = getDatabase(bobFirestore);
    await bobDatabase.createClass("CS1260",
      {
        name: "bobby lim",
        id: "bob",
        email: "bob@email.com"
      },
      ["charlie@email.com"],
      ["denny@email.com", "ella@gmail.com"]
    ).then(async () => {
      const dennyFirestore = testEnv.authenticatedContext('denny', {email: "denny@email.com"}).firestore();
      const dennyDatabase = getDatabase(dennyFirestore);
      return await assertFails(dennyDatabase.getInvites("ella@gmail.com", "tutor"));
    });
  });
})