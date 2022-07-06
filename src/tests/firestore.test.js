const { readFileSync } = require('fs');
const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const { collection, addDoc, setLogLevel } = require('firebase/firestore');
const getDatabase = require("../database").default;

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-project-1234",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Classes', () => {
  it('should not let unauthenticated users add class', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const firestore = getDatabase(unauthedDb);
    await assertFails(firestore.createClass("CS1234",
      {
        name: "unknown user",
        id: 123,
        email: "unknown@email.com"
      }, 
      ["student@email.com"],
      []
    ));
  })

  it('should let authenticated users add class', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const firestore = getDatabase(aliceDb);
    await assertSucceeds(firestore.createClass("CS1234",
      {
        name: "unknown user",
        id: 123,
        email: "unknown@email.com"
      }, 
      ["student@email.com"],
      []
    ));
  })

});
