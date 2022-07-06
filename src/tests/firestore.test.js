const { readFileSync } = require('fs');
const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;
const { collection, addDoc, setLogLevel } = require('firebase/firestore');

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
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
    const classesRef = collection(unauthedDb, "classes");
    await assertFails(addDoc(classesRef,
      {
        className: "CS1234",
      }
    ));
  })

  it('should let authenticated users add class', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const classesRef = collection(aliceDb, "classes");
    await assertSucceeds(addDoc(classesRef, {
      className: "CS1234",
    }));
  })

});
