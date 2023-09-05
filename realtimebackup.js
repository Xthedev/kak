const Usersdb = new PouchDB("usersdb");
const Messagesdb = new PouchDB("messagesdb");
const Sessiondb = new PouchDB("sessiondb");
const Notificationsdb = new PouchDB("notificationsdb");
// online variant
//syncfunction
PouchDB.sync(
  Usersdb,
  "https://admin:senseix1234!!A@backend.getknacks.com/social",
  {
    live: true,
    retry: true,
  }
)
  .on("change", function (info) {
    // handle change
    console.log("database has changed");
    try {
      //update logged in user details
      theuser = JSON.parse(localStorage.getItem("loggedinuser"));
      Usersdb.get(theuser.email)
        .then(function (response) {
          localStorage.setItem("loggedinuser", JSON.stringify(response));
        })
        .catch(function (err) {});
    } catch (error) {}
  })
  .on("paused", function (err) {
    // replication paused (e.g. replication up to date, user went offline)
  })
  .on("active", function () {
    // replicate resumed (e.g. new changes replicating, user went back online)
  })
  .on("denied", function (err) {
    // a document failed to replicate (e.g. due to permissions)
  })
  .on("complete", function (info) {
    // handle complete
  })
  .on("error", function (err) {
    // handle error
  });

PouchDB.sync(
  Messagesdb,
  "https://admin:senseix1234!!A@backend.getknacks.com/messages",
  {
    live: true,
    retry: true,
  }
)
  .on("change", function (info) {
    // handle change
    console.log("database has changed");
    try {
      LoadCurrentChats();
    } catch (error) {}
  })
  .on("paused", function (err) {
    // replication paused (e.g. replication up to date, user went offline)
  })
  .on("active", function () {
    // replicate resumed (e.g. new changes replicating, user went back online)
  })
  .on("denied", function (err) {
    // a document failed to replicate (e.g. due to permissions)
  })
  .on("complete", function (info) {
    // handle complete
  })
  .on("error", function (err) {
    // handle error
  });

PouchDB.sync(
  Notificationsdb,
  "https://admin:senseix1234!!A@backend.getknacks.com/notifications",
  {
    live: true,
    retry: true,
  }
)
  .on("change", function (info) {
    // handle change
    console.log("database has changed");
  })
  .on("paused", function (err) {
    // replication paused (e.g. replication up to date, user went offline)
  })
  .on("active", function () {
    // replicate resumed (e.g. new changes replicating, user went back online)
  })
  .on("denied", function (err) {
    // a document failed to replicate (e.g. due to permissions)
  })
  .on("complete", function (info) {
    // handle complete
  })
  .on("error", function (err) {
    // handle error
  });
