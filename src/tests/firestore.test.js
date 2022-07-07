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

describe('Classes', () => {
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
  
  /*it('should let head tutors invite students', async () => {
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
    console.log(classSnapshot)
    return await assertSucceeds(firestore.addInvites(
      classSnapshot.id, [], "student")
    );
  });*/
})