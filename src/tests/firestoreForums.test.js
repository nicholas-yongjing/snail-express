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

  it("should not let users create forum posts with incorrect author id", async () => {
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
              return assertFails(barryDb.addForumPost(snapshot.id, threads[0].id, "barry's post", "hi everyone", "wrongId"))
            }),
          dennyDb.getInvites("denny@email.com", "student")
            .then((invites) => {
              return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
            }).then(() => {
              return dennyDb.getClasses("denny", "student");
            }).then((classes) => {
              return dennyDb.getForumThreads(classes[0].id);
            }).then((threads) => {
              return assertFails(dennyDb.addForumPost(snapshot.id, threads[0].id, "denny's post", "hi everyone!", "wrongId"))
            }),
          elvinDb.getInvites("elvin@gmail.com", "tutor")
            .then((invites) => {
              return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
            }).then(() => {
              return elvinDb.getClasses("elvin", "tutor");
            }).then((classes) => {
              return elvinDb.getForumThreads(classes[0].id);
            }).then((threads) => {
              return assertFails(elvinDb.addForumPost(snapshot.id, threads[0].id, "elvin's post", "hi everyone!!", "wrongId"))
            })
        ]);
      });
  });

  it("should only let valid users create forum posts", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser', { email: "otherUser@gmail.com" }).firestore();
    const otherDb = getDatabase(otherFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );

    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")

    return barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
      .then(() => {
        return Promise.all([
          assertFails(otherDb.addForumPost(classSnapshot.id, threadSnapshot.id, "I'm not allowed to post", "read the title", "otheruser")),
          assertSucceeds(barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry")),
          dennyDb.getInvites("denny@email.com", "student")
            .then((invites) => {
              return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
            }).then(() => {
              return dennyDb.addForumPost(classSnapshot.id, threadSnapshot.id, "denny's post", "hi everyone!", "denny")
            }),
          elvinDb.getInvites("elvin@gmail.com", "tutor")
            .then((invites) => {
              return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
            }).then(() => {
              return elvinDb.addForumPost(classSnapshot.id, threadSnapshot.id, "elvin's post", "hi everyone!!", "elvin");
            })
        ]);
      });
  });

  it("should only let author edit forum posts", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser', { email: "otherUser@gmail.com" }).firestore();
    const otherDb = getDatabase(otherFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");
    
    return Promise.all([
      assertFails(otherDb.editForumPost(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "not allowed to edit", "not allowed")),
      assertSucceeds(barryDb.editForumPost(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "i can edit post", "this is new content")),
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }).then(() => {
          return assertFails(dennyDb.editForumPost(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "not allowed to edit", "not allowed"))
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        }).then(() => {
          return assertFails(elvinDb.togglePostvote(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "not allowed to edit", "not allowed"))
        })
    ]).then(() => {
      return dennyDb.getForumPosts(classSnapshot.id, threadSnapshot.id);
    }).then((posts) => {
      expect(posts[0].title).toBe("i can edit post");
      expect(posts[0].body).toBe("this is new content");
    });
  });

  it("should let users view forum posts", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );

    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")

    return Promise.all([
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        })
    ]).then(() => {
      return barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");
    }).then(() => {
      return dennyDb.addForumPost(classSnapshot.id, threadSnapshot.id, "denny's post", "bye everyone", "denny")
    }).then(() => {
      return elvinDb.addForumPost(classSnapshot.id, threadSnapshot.id, "elvin's post", "hi everyone!!", "elvin")
    }).then(() => {
      return Promise.all([
        barryDb.getForumPosts(classSnapshot.id, threadSnapshot.id),
        dennyDb.getForumPosts(classSnapshot.id, threadSnapshot.id),
        elvinDb.getForumPosts(classSnapshot.id, threadSnapshot.id),
      ])
    }).then((promises) => {
      const expectedTitle = ["barry's post", "denny's post", "elvin's post"];
      const expectedBody = ["hi everyone", "bye everyone", "hi everyone!!"];
      return promises.forEach((posts) => {
        expect(posts.length).toBe(3);
        for (let i = 0; i < 3; i++) {
          expect(posts[i].title).toBe(expectedTitle[i]);
          expect(posts[i].body).toBe(expectedBody[i]);
        }
      });
    });
  });

  it("should only let class users create forum replies", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser', { email: "otherUser@gmail.com" }).firestore();
    const otherDb = getDatabase(otherFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");

    return Promise.all([
      assertFails(otherDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "im not allowed to reply", "otherUser")),
      assertSucceeds(barryDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "reply myself", "barry")),
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }).then(() => {
          return assertSucceeds(dennyDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "reply teacher", "denny"))
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        }).then(() => {
          return assertSucceeds(elvinDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "reply boss", "elvin"))
        })
    ]);
  });

  it("should only let class users vote on posts", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser', { email: "otherUser@gmail.com" }).firestore();
    const otherDb = getDatabase(otherFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");

    return Promise.all([
      assertFails(otherDb.togglePostvote("otherUser", "upvote", classSnapshot.id, threadSnapshot.id, postSnapshot.id)),
      assertSucceeds(barryDb.togglePostvote("barry", "upvote", classSnapshot.id, threadSnapshot.id, postSnapshot.id)),
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }).then(() => {
          return assertSucceeds(dennyDb.togglePostvote("denny", "downvote", classSnapshot.id, threadSnapshot.id, postSnapshot.id))
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        }).then(() => {
          return assertSucceeds(elvinDb.togglePostvote("elvin", "downvote", classSnapshot.id, threadSnapshot.id, postSnapshot.id))
        })
    ]).then(() => {
      return barryDb.getForumPosts(classSnapshot.id, threadSnapshot.id);
    }).then((posts) => {
      expect(posts[0].upvoters.length).toBe(1);
      expect(posts[0].downvoters.length).toBe(2);
    });
  });

  it("should only let head tutors and tutors endorse posts", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser', { email: "otherUser@gmail.com" }).firestore();
    const otherDb = getDatabase(otherFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");

    return Promise.all([
      assertFails(otherDb.togglePostEndorsement(classSnapshot.id, threadSnapshot.id, postSnapshot.id)),
      assertSucceeds(barryDb.togglePostEndorsement(classSnapshot.id, threadSnapshot.id, postSnapshot.id)),
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }).then(() => {
          return assertFails(dennyDb.togglePostEndorsement(classSnapshot.id, threadSnapshot.id, postSnapshot.id))
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        })
    ]).then(() => {
      return barryDb.getForumPosts(classSnapshot.id, threadSnapshot.id);
    }).then((posts) => {
      expect(posts[0].endorsed).toBe(true);
    }).then(() => {
      return assertSucceeds(elvinDb.togglePostEndorsement(classSnapshot.id, threadSnapshot.id, postSnapshot.id))
    }).then(() => {
      return barryDb.getForumPosts(classSnapshot.id, threadSnapshot.id);
    }).then((posts) => {
      expect(posts[0].endorsed).toBe(false);
    });
  });

  it("should only let valid users reply to posts", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser', { email: "otherUser@gmail.com" }).firestore();
    const otherDb = getDatabase(otherFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");

    return Promise.all([
      assertFails(otherDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "not allowed to reply", "otherUser")),
      assertSucceeds(barryDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "replying as head tutor", "barry")),
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }).then(() => {
          return assertSucceeds(dennyDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "student's reply", "denny"));
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        }).then(() => {
          return assertSucceeds(elvinDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "tutor's reply", "elvin"));
        }),
    ]);
  });

  it("should only let valid users view replies", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);
    const otherFirestore = testEnv.authenticatedContext('otherUser', { email: "otherUser@gmail.com" }).firestore();
    const otherDb = getDatabase(otherFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");

    return barryDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "barry's reply", "barry")
      .then(() => {
        return Promise.all([
          assertFails(otherDb.getForumReplies(classSnapshot.id, threadSnapshot.id, postSnapshot.id)),
          barryDb.getForumReplies(classSnapshot.id, threadSnapshot.id, postSnapshot.id),
          dennyDb.getInvites("denny@email.com", "student")
            .then((invites) => {
              return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
            }).then(() => {
              return dennyDb.getForumReplies(classSnapshot.id, threadSnapshot.id, postSnapshot.id);
            }),
          elvinDb.getInvites("elvin@gmail.com", "tutor")
            .then((invites) => {
              return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
            }).then(() => {
              return elvinDb.getForumReplies(classSnapshot.id, threadSnapshot.id, postSnapshot.id);
            }),
        ]);
      }).then((promises) => {
        for (let i = 1; i < 4; i++) {
          let replies = promises[i];
          expect(replies.length).toBe(1);
          expect(replies[0].body).toBe("barry's reply")
        }
      });
  });
  
  it("should only let authors edit replies", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");
    const replySnapshot = await barryDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "barry's reply", "barry");

    return Promise.all([
      assertSucceeds(barryDb.editForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, replySnapshot.id, "i can edit reply")),
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }).then(() => {
          return assertFails(dennyDb.editForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, replySnapshot.id, "not allowed to edit"));
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        }).then(() => {
          return assertFails(elvinDb.editForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, replySnapshot.id, "not allowed to edit"));
        }),
    ]);
  });

  it("should only let head tutors and tutors endorse replies", async () => {
    const barryFirestore = testEnv.authenticatedContext('barry').firestore();
    const barryDb = getDatabase(barryFirestore);
    const dennyFirestore = testEnv.authenticatedContext('denny', { email: "denny@email.com" }).firestore();
    const dennyDb = getDatabase(dennyFirestore);
    const elvinFirestore = testEnv.authenticatedContext('elvin', { email: "elvin@gmail.com" }).firestore();
    const elvinDb = getDatabase(elvinFirestore);

    const classSnapshot = await barryDb.createClass("CS2134",
      {
        name: "barry ong",
        id: "barry",
        email: "barryong@email.com"
      },
      ["denny@email.com"],
      ["elvin@gmail.com"]
    );
    const threadSnapshot = await barryDb.addForumThread(classSnapshot.id, "New General Class Thread")
    const postSnapshot = await barryDb.addForumPost(classSnapshot.id, threadSnapshot.id, "barry's post", "hi everyone", "barry");
    const replySnapshot = await barryDb.addForumReply(classSnapshot.id, threadSnapshot.id, postSnapshot.id, "barry's reply", "barry");

    return Promise.all([
      assertSucceeds(barryDb.togglePostEndorsement(classSnapshot.id, threadSnapshot.id, postSnapshot.id, replySnapshot.id)),
      dennyDb.getInvites("denny@email.com", "student")
        .then((invites) => {
          return dennyDb.acceptInvite(invites[0].id, "denny", "student", "denny@email.com", "denny tan");
        }).then(() => {
          return assertFails(dennyDb.togglePostEndorsement(classSnapshot.id, threadSnapshot.id, postSnapshot.id, replySnapshot.id));
        }),
      elvinDb.getInvites("elvin@gmail.com", "tutor")
        .then((invites) => {
          return elvinDb.acceptInvite(invites[0].id, "elvin", "tutor", "elvin@gmail.com", "elvin lim");
        }).then(() => {
          return assertSucceeds(elvinDb.togglePostEndorsement(classSnapshot.id, threadSnapshot.id, postSnapshot.id, replySnapshot.id));
        }),
    ]);
  });
})
