const Usersdb = new PouchDB("usersdb");
const Messagesdb = new PouchDB("messagesdb");
const Sessiondb = new PouchDB("sessiondb");
const Notificationsdb = new PouchDB("notificationsdb");
// online variant
//syncfunction
PouchDB.sync(
  Usersdb,
  "http://admin:senseix1234!!A@20.124.122.164:5984/social",
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
  "http://admin:senseix1234!!A@20.124.122.164:5984/messages",
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
  "http://admin:senseix1234!!A@20.124.122.164:5984/notifications",
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
