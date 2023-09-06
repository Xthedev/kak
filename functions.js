/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                                                      CREATE NEW USER FUNCTION                                                                                      */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

// USER SCHEMA
const User = {
  _id: "",
  fullname: "",
  email: "",
  password: "",
  country: "",
  state: "",
  city: "",
  language: "",
  bio: "",
  likes: "",
  avatar: "",
  friends: [],
  date_added: "",
  time_added: "",
};

//MESSAGES
const Messages = {
  _id: "",
  messages: [],
};
//USER SCHEMA ENDS HERE
//VALIDATE EMAIL ADDRESS
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
//VALIDATE PASSWORD

function validatePassword(password) {
  const re = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
  return re.test(String(password).toLowerCase());
}
/* ------------------------------------- SIMULATE FILE CLICK ------------------------------------ */

function simulateFileInputClick(anchorId, fileInputId) {
  const anchor = document.getElementById(anchorId);
  const fileInput = document.getElementById(fileInputId);

  if (anchor && fileInput) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent the default anchor tag behavior

      // Trigger a click event on the file input element
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      fileInput.dispatchEvent(clickEvent);
    });
  } else {
    console.log("Anchor or file input element not found");
  }
}
/* ------------------------------------- SIMULATE FILE CLICK ------------------------------------ */

// Usage example:
// Call the function with the IDs of the anchor tag and file input element
simulateFileInputClick("fileanchor", "file-input");
simulateFileInputClick("fileanchor", "file-inputtwo");

/* ---------------------------------------------------------------------------------------------- */
/*                                        REGISTRATION CODE                                       */
/* ---------------------------------------------------------------------------------------------- */
try {
  // CREATE A NEW USER ONCE USER CLICKS BUTTON
  document
    .getElementById("registeruser")
    .addEventListener("click", function () {
      //add loading indicator
      Notiflix.Loading.standard("Please wait..");
      let user = User;
      user._id = document.getElementById("email").value.trim().toLowerCase();
      user.fullname = document
        .getElementById("fullname")
        .value.trim()
        .toLowerCase();
      user.email = document.getElementById("email").value.trim().toLowerCase();
      user.password = document.getElementById("password").value.trim();

      console.log(user);
      /* ----------------------------------- IF USER EMAIL IS VALID ----------------------------------- */
      if (validateEmail(user.email)) {
        /* -------------------------------------- VALIDATE PASSWORD ------------------------------------- */
        if (validatePassword(user.password)) {
          /* ---------------------------------- Check if passwords match ---------------------------------- */
          if (
            user.password ===
            document.getElementById("confirmpassword").value.trim()

            /* --------------------------------- CHECK IF ITS SAME PASSWORD --------------------------------- */
          ) {
            /* ------------------------------ CHECK IF THE USER ALREADY EXISTS ------------------------------ */
            Usersdb.get(user.email)
              .then(function (doc) {
                // handle doc
                Notiflix.Loading.remove();
                Notiflix.Report.failure(
                  "Notification",
                  "Sorry user with this email already exists !!"
                );
              })
              .catch(function (err) {
                Usersdb.put(user)
                  .then(function (response) {
                    // handle response
                    Notiflix.Loading.remove();
                    Notiflix.Report.success(
                      "Notification",
                      "User Registration Successfull, redirecting to login !!"
                    );
                    setTimeout(function () {
                      location.assign("login.html");
                    }, 2000);
                  })
                  .catch(function (err) {
                    Notiflix.Loading.remove();
                    Notiflix.Report.failure(
                      "Notification",
                      "Sorry Registration failed try again!!"
                    );
                  });
              });
          } else {
            Notiflix.Loading.remove();
            Notiflix.Report.failure("Notification", "Passwords do not match");
          }
        } else {
          /* ------------------------------------ PASSWORD IS NOT VALID ----------------------------------- */
          Notiflix.Loading.remove();
          Notiflix.Report.failure(
            "Notification",
            "Should Contain an uppercase, lowercase,symbol,number and at least 8 characters"
          );
        }
      } else {
        Notiflix.Loading.remove();
        Notiflix.Report.failure("Notification", "Provided email is invalid !!");
      }
    });
} catch (error) {}

/* ---------------------------------------------------------------------------------------------- */
/*                                        REGISTRATION CODE                                       */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/*                                           LOGIN CODE                                           */
/* ---------------------------------------------------------------------------------------------- */
try {
  document.getElementById("loginbutton").addEventListener("click", function () {
    //add loading indicator
    Notiflix.Loading.standard("Please wait..");
    let email = document.getElementById("email").value.trim().toLowerCase();
    let password = document.getElementById("password").value.trim();

    if (validateEmail(email)) {
      Usersdb.get(email)
        .then(async function (doc) {
          // handle
          if (doc.password == password) {
            // change docid and set for sessoin
            /* ---------------------------------- STORE IN SESSION STORAGE ---------------------------------- */
            localStorage.setItem("loggedinuser", JSON.stringify(doc));
            //create session
            Notiflix.Loading.remove();
            Notiflix.Report.success(
              "Notification",
              "Logged In ,redirecting to dashboard!!"
            );

            /* ----------------------------------- Re-direct to dashboard ----------------------------------- */
            setTimeout(function () {
              location.assign("dashboard.html");
            }, 2000);
            /* ----------------------------------- Re-direct to dashboard ----------------------------------- */
          } else {
            Notiflix.Loading.remove();
            Notiflix.Report.failure(
              "Notification",
              "Sorry Invalid Email or Password !!"
            );
          }
        })
        .catch(function (err) {
          Notiflix.Loading.remove();
          Notiflix.Report.failure(
            "Notification",
            "Sorry No user with this email  exists !!"
          );
        });
    } else {
      Notiflix.Loading.remove();
      Notiflix.Report.failure("Notification", "Provided email is invalid !!");
    }
  });
} catch (error) {}

/* ---------------------------------------------------------------------------------------------- */
/*                                           LOGIN CODE                                           */
/* ---------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */
/*                                           UPDATE BIO                                           */
/* ---------------------------------------------------------------------------------------------- */
const inputFile = document.getElementById("file-input");
try {
  // listen for change in file
  inputFile.addEventListener("change", function (event) {
    let theuser = JSON.parse(localStorage.getItem("loggedinuser"));
    Notiflix.Loading.standard("Uploading Avatar Please Wait.");
    const selectedFile = event.target.files[0]; // Assuming a single file input

    if (selectedFile) {
      let fullurl = "";
      const reader = new FileReader();

      reader.onload = async function (e) {
        const base64Data = e.target.result; // Get the Base64 data
        console.log(base64Data);
        // Make a POST request to avatar.getknacks.com with the Base64 data
        const apiUrl = "https://avatar.getknacks.com"; // Replace with the actual API endpoint
        const requestData = { imagefile: base64Data }; // Replace with any other required data

        await fetch(apiUrl, {
          method: "POST",

          body: JSON.stringify(requestData),
        })
          .then((response) => response.json())
          .then((data) => {
            //remove loader
            Notiflix.Loading.remove();
            //baseurl
            let baseurl = "https://avatar.getknacks.com/images/";

            Usersdb.get(theuser.email)
              .then(function (doc) {
                doc.avatar = baseurl + data.data;
                fullurl = baseurl + data.data;
                console.log(fullurl);
                //savetwice localstorage bug
                localStorage.setItem("loggedinuser", JSON.stringify(doc));
                localStorage.setItem("loggedinuser", JSON.stringify(doc));
                //savetwice localstorage bug
                return Usersdb.put(doc);
              })
              .then(function (response) {
                console.log(fullurl);
                document.getElementById(
                  "profileimage"
                ).style.backgroundImage = `url('${fullurl}')`;
                document.getElementById(
                  "profileimage"
                ).style.backgroundPosition = "center";
                document.getElementById("profileimage").style.backgroundSize =
                  "cover";
                Notiflix.Loading.remove();
                // handle response
                Notiflix.Report.success(
                  "Notification",
                  "Profile Image uploaded successfully"
                );
              })
              .catch(function (err) {
                //remove loader
                Notiflix.Loading.remove();
                Notiflix.Report.failure("Notification", "An Error Occured");
                console.log(err);
              });
            // Handle the server's response as needed
          })
          .catch((error) => {
            //remove loader
            Notiflix.Loading.remove();
            Notiflix.Report.failure("Error Occured", error.toString());
            console.error("Error:", error);
            // Handle errors
          });
      };

      // Read the selected file as Data URL (which includes Base64 data)
      reader.readAsDataURL(selectedFile);
    }
  });
} catch (error) {}

/* ---------------------------------------------------------------------------------------------- */
/*                                         UPDATE USER BIO                                        */
/* ---------------------------------------------------------------------------------------------- */
try {
  document.getElementById("savebio").addEventListener("click", function () {
    Notiflix.Loading.standard("Please wait updating bio   ");
    let theuser = JSON.parse(localStorage.getItem("loggedinuser"));

    if (theuser.avatar == "") {
      Notiflix.Report.warning(
        "Notice",
        "You need to have an Avatar please upload One...(Compulsory.)"
      );
    } else {
      //fillupallnewrecords
      theuser.fullname =
        document.getElementById("firstname").value +
        " " +
        document.getElementById("lastname").value;
      theuser.country = document.getElementById("country").value;
      theuser.state = document.getElementById("state").value;
      theuser.city = document.getElementById("city").value;
      theuser.bio = document.getElementById("biotwo").value;

      if (
        theuser.firstname == "" ||
        theuser.lastname == "" ||
        theuser.country == "" ||
        theuser.state == "" ||
        theuser.city == "" ||
        theuser.bio == ""
      ) {
        Notiflix.Loading.remove();
        Notiflix.Report.warning("Notification", "Please complete all fields");
      } else {
        Usersdb.get(theuser.email)
          .then(function (doc) {
            //savetwice localstorage bug
            console.log(theuser);
            localStorage.setItem("loggedinuser", JSON.stringify(theuser));
            localStorage.setItem("loggedinuser", JSON.stringify(theuser));
            //savetwice localstorage bug
            theuser.email = doc._id;
            theuser._rev = doc._rev;
            return Usersdb.put(theuser);
          })
          .then(function (response) {
            Notiflix.Loading.remove();
            // handle response
            Notiflix.Report.success(
              "Notification",
              "Profile updated successfully"
            );
            demgofeelit();
          })
          .catch(function (err) {
            //remove loader
            Notiflix.Loading.remove();
            Notiflix.Report.failure("Notification", "An Error Occured".err);
            console.log(err);
          });
      }
    }
  });
} catch (error) {}
/* ---------------------------------------------------------------------------------------------- */
/*                                           UPDATE BIO                                           */
/* ---------------------------------------------------------------------------------------------- */

/* ------------------------------------ RENDER  LIST OF USERS ----------------------------------- */
try {
  Usersdb.allDocs({
    include_docs: true,
    attachments: true,
    limit: 20,
  })
    .then(function (result) {
      let me = JSON.parse(localStorage.getItem("loggedinuser"));
      // handle result
      console.log(result);

      // Write a condition
      if (result.rows.length < 1) {
        let info = document.createElement("h3");
        info.innerHTML = "No Users found";
        document.getElementById("listofusers").appendChild(info);
      } else {
        //create div

        // let template = "";
        document.getElementById("listofusers").innerHTML = "";
        result.rows.map((item) => {
          if (item.doc.email == me.email) {
          } else {
            let card = document.createElement("div");
            card.classList.add("col-6");
            card.classList.add("pe-2");
            let link = document.createElement("a");
            link.classList.add("card");
            link.classList.add("card-style");
            link.classList.add("mx-0");
            link.classList.add("mb-3");
            link.setAttribute("data-card-height", "150");
            link.style.height = "40vh";
            link.style.backgroundImage = `url('${item.doc.avatar}')`;

            //card
            let cardbottom = document.createElement("div");
            cardbottom.classList.add("card-bottom");
            cardbottom.classList.add("ps-3");
            //h1
            let heading = document.createElement("h1");
            heading.classList.add("color-white");
            heading.classList.add("mb-n1");
            heading.classList.add("font-14");

            heading.textContent = item.doc.fullname;

            //h1append

            //paragaraph
            let para = document.createElement("p");
            para.classList.add("color-white");
            para.classList.add("opacity-50");
            para.classList.add("mb-0");
            para.classList.add("font-11");
            para.classList.add("mt-n2");
            para.textShadow = "2px 2px #ff0000";
            para.textContent = item.doc.country + ", " + item.doc.state;
            //link
            cardbottom.appendChild(heading);
            cardbottom.appendChild(para);
            link.appendChild(cardbottom);
            card.appendChild(link);
            card.addEventListener("click", function () {
              // delete item.doc.password;
              //remove if existed before
              try {
                localStorage.removeItem("visitingprofile");
              } catch (error) {}
              //store twice
              localStorage.setItem("visitingprofile", JSON.stringify(item.doc));
              localStorage.setItem("visitingprofile", JSON.stringify(item.doc));
              //redirect to view the persons profile
              location.assign("/visitprofile.html");
            });
            document.getElementById("listofusers").appendChild(card);
          }
        });
      }
    })
    .catch(function (err) {});
} catch (err) {}

/* ----------------------------------------- COMING SOON ---------------------------------------- */
try {
  let comingsoon = document.getElementsByClassName("comingsoon");
  for (x = 0; x < comingsoon.length; x++) {
    comingsoon[x].addEventListener("click", function () {
      Notiflix.Report.success(
        "New Updates",
        "This feature would be available soon."
      );
    });
  }
} catch (error) {}

try {
  document.getElementById("startchat").addEventListener("click", function () {
    let me = JSON.parse(localStorage.getItem("loggedinuser"));

    let myfriend = JSON.parse(localStorage.getItem("visitingprofile"));
    let checkiffriendexists = me.friends.filter(
      (element) => element.friend == myfriend.email
    );

    /* --------------------------- IF YOU ARE NOT ALREADY A FRIEND DO THIS -------------------------- */
    if (checkiffriendexists.length < 1) {
      //friendsadded
      let friend = { friend: myfriend.email };
      me.friends.push(friend);
      //add me to myfriend
      let meow = { friend: me.email };
      myfriend.friends.push(meow);

      //make the changes
      Usersdb.get(me.email)
        .then(function (doc) {
          me._id = doc._id;
          me._rev = doc._rev;
          return Usersdb.put(me);
        })
        .then(function (response) {
          // handle

          /* -------------------------------- ADD ME TO MY FRIENDS ACCOUNT -------------------------------- */
          Usersdb.get(myfriend.email)
            .then(function (doc) {
              myfriend._id = doc._id;
              myfriend._rev = doc._rev;
              return Usersdb.put(myfriend);
            })
            .then(function (response) {
              // handle
              console.log(response);
            })
            .catch(function (err) {
              console.log(err);
            });

          /* -------------------------------- ADD ME TO MY FRIENDS ACCOUNT -------------------------------- */

          console.log(response);
        })
        .catch(function (err) {});
    }

    // SET THE PERSON WHO YOU ARE ABOUT TO CHAT WITH
    localStorage.setItem("activechat", JSON.stringify(myfriend));
    localStorage.setItem("activechat", JSON.stringify(myfriend));
    //ASK THE PERSON IF YOU WANT TO CHAT WITH THE PERESON
    Notiflix.Confirm.show(
      "Start A Conversation",
      "Do you Want to chat with this person.?",
      "Yes",
      "No",
      () => {
        location.assign("messages.html");
      },
      () => {
        //do something here
      },
      {}
    );
    /* --------------- ADD SESSION FOR CHAT AND TAKE THE PERSON TO CONVERSATION SCREEN -------------- */
  });
} catch (error) {}
const Messagessingle = {
  _id: "",
  senderid: "",
  receiverid: "",
  message: "",
  attachment: "",
  date_added: "",
  time_added: "",
};

//messageid
function concatenateEmails(email1, email2) {
  // Convert both emails to lowercase for case-insensitive comparison
  const lowerEmail1 = email1.toLowerCase();
  const lowerEmail2 = email2.toLowerCase();

  // Compare the two emails alphabetically
  if (lowerEmail1 < lowerEmail2) {
    return email1 + email2;
  } else {
    return email2 + email1;
  }
}
//get current date
function getCurrentDate() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const year = currentDate.getFullYear();

  return `${day}-${month}-${year}`;
}
//getcurrenttime
function getCurrentTime() {
  const currentTime = new Date();
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

// Example usage:

// Example usage:
// const email1 = "john@example.com";
// const email2 = "alice@example.com";

// const concatenatedEmail = concatenateEmails(email1, email2);
// console.log("Concatenated Email:", concatenatedEmail);
function LoadCurrentChats() {
  try {
    //current chats
    let mfriend = JSON.parse(localStorage.getItem("activechat"));
    let mme = JSON.parse(localStorage.getItem("loggedinuser"));
    let messageid = concatenateEmails(mfriend.email, mme.email);
    Messagesdb.get(messageid)
      .then(function (doc) {
        var template = "";
        // MESSAGES
        doc.messages.map((item, index) => {
          console.log(item.senderid);
          console.log(mme.email);
          if (item.senderid === mme.email) {
            if (item.attachment !== "") {
              template += `
 <div data-key="${index}" data-conversation="${messageid}" class="speech-bubble speech-left bg-highlight"  onclick="removeChat(this)">
 <img src="${item.attachment}" width="150px" />
                   ${item.message}  <br>
<span style="font-size10px;">${item.time_added.slice(0, -3)}</span>
                </div>
                <div class="clearfix"></div>
            `;
            } else {
              template += `
 <div  data-key="${index}" data-conversation="${messageid}"  class="speech-bubble speech-left bg-highlight"  onclick="removeChat(this)">
                   ${item.message} <br>
   <span style="font-size10px;">${item.time_added.slice(0, -3)}</span>
                </div>
                <div class="clearfix"></div>
            `;
            }
          } else {
            if (item.attachment !== "") {
              template += `
           <div data-key="${index}" data-conversation="${messageid}" class="speech-bubble speech-right color-black"  onclick="removeChat(this)">
                
                  <img  src="${item.attachment}" width="150px" />
                            ${item.message}
                            <br>
    <span style="font-size10px;">${item.time_added.slice(0, -3)}</span>
                            </div>
                            <div class="clearfix"></div>
                        `;
            } else {
              template += `
               <div data-key="${index}" data-conversation="${messageid}"  class="speech-bubble speech-right color-black" onclick="removeChat(this)">
                   ${item.message}    <br>
         <span style="font-size10px;">${item.time_added.slice(0, -3)}</span>
                </div>
                <div class="clearfix"></div>
        
            `;
            }
          }
        });
        document.getElementById("activeconversation").innerHTML = template;
        window.scrollTo(0, document.body.scrollHeight);
      })
      .catch(function (err) {});
  } catch (error) {}
  //   console.log("new chat");
}
LoadCurrentChats();
try {
  let thecurrentchat = JSON.parse(localStorage.getItem("activechat"));
  document.getElementById("chatprofilepic").src = thecurrentchat.avatar;
  document.getElementById("chatprofilepic").style.objectFit = "cover";
  document.getElementById("chatpeson").textContent = thecurrentchat.fullname;
  // Get a reference to the div element with the ID "thefullchatscreen"
  window.scrollTo(0, document.body.scrollHeight);

  //sendmessage
  document.getElementById("sendmessage").addEventListener("click", function () {
    let myownemail = JSON.parse(localStorage.getItem("loggedinuser"));
    // GENERATE MESSAGE ID
    let messageid = concatenateEmails(myownemail.email, thecurrentchat.email);
    let themessage = Messagessingle;
    themessage._id = messageid;
    themessage.senderid = myownemail.email;
    themessage.receiverid = thecurrentchat.email;
    themessage.message = document.getElementById("themessage").value;
    themessage.date_added = getCurrentDate();
    themessage.time_added = getCurrentTime();

    // STORE THE MESSAGE AND ADD TO THE ARRAY OF CHATS
    /* ------------- THERE ARE TWO CONDITIONS ONE IS IF THERE ARE ALREADY CONVERSATIONS ------------- */
    Messagesdb.get(messageid)
      .then(function (doc) {
        console.log(doc);
        // return db.put({
        //   _id: "mydoc",
        //   _rev: doc._rev,
        //   title: "Let's Dance",
        // });
        let newmessage = doc;
        newmessage._id = messageid;
        newmessage._rev = doc._rev;
        newmessage.messages.push(themessage);
        /* ------------------------------------- MESSAGES CREATE NEW ------------------------------------ */
        Messagesdb.put(newmessage).then(function (doc) {
          document.getElementById("themessage").value = "";
          //doc output here
        });
      })
      .then(function (response) {
        // handle response
        console.log(response);
      })
      .catch(function (err) {
        // console.log(err);
        let newmessage = Messages;
        newmessage._id = messageid;
        newmessage.messages = [];
        newmessage.messages.push(themessage);
        /* ------------------------------------- MESSAGES CREATE NEW ------------------------------------ */
        Messagesdb.put(newmessage).then(function (doc) {
          //doc output here
          document.getElementById("themessage").value = "";
        });
      });

    /* --------------------- THE SECOND CONDITION IS IF THERE ARE NO CONVERSATIONS -------------------- */
  });
} catch (error) {}
/* -------------------------------------- remove duplicates ------------------------------------- */
function removeDuplicatesByKey(arr) {
  const seen = {}; // Object to keep track of encountered keys
  return arr.filter((item) => {
    const keyValue = item["doc"].email;
    if (!seen[keyValue]) {
      seen[keyValue] = true; // Mark the key as seen
      return true; // Keep the first occurrence
    }
    return false; // Remove duplicates
  });
}
/* -------------------------------------- search like by name mysql ------------------------------------- */
function searchLike(array, pattern) {
  const regex = new RegExp(pattern, "i"); // 'i' flag makes the search case-insensitive
  return array.filter((item) => regex.test(item.doc.fullname));
}
/* ----------------------------------- search like by location ---------------------------------- */
/* -------------------------------------- search by country ------------------------------------- */
function searchLikecountry(array, pattern) {
  const regex = new RegExp(pattern, "i"); // 'i' flag makes the search case-insensitive
  return array.filter((item) => regex.test(item.doc.country));
}

/* --------------------------------------- search by state -------------------------------------- */
function searchLikestate(array, pattern) {
  const regex = new RegExp(pattern, "i"); // 'i' flag makes the search case-insensitive
  return array.filter((item) => regex.test(item.doc.state));
}
/* --------------------------------------- search by city --------------------------------------- */
function searchLikecity(array, pattern) {
  const regex = new RegExp(pattern, "i"); // 'i' flag makes the search case-insensitive
  return array.filter((item) => regex.test(item.doc.city));
}
/* -------------------------------------- SEARCH AND FILTER ------------------------------------- */
try {
  document
    .getElementById("searchforuser")
    .addEventListener("keyup", function (e) {
      /* ----------------------- SEARCH FOR THE USERS BY CHECKING WITH A FILTER ----------------------- */
      console.log(e.target.value);
      Usersdb.allDocs({
        include_docs: true,
        attachments: true,
      })
        .then(function (result) {
          let me = JSON.parse(localStorage.getItem("loggedinuser"));
          // handle result
          // console.log(result);
          // Write a condition
          if (result.rows.length < 1) {
            let info = document.createElement("h3");
            info.innerHTML = "No Users found";
            document.getElementById("listofusers").appendChild(info);
          } else {
            /* ------------------------------ SEARCH BY NAME COUNTRY STATE CITY ----------------------------- */
            let itemlist = searchLike(result.rows, e.target.value);
            let itemlisttwo = searchLikestate(result.rows, e.target.value);
            let itemlistthree = searchLikecountry(result.rows, e.target.value);
            let itemlistfour = searchLikecity(result.rows, e.target.value);
            //concat and provide final array
            const mergedArray = itemlist.concat(
              itemlisttwo,
              itemlistthree,
              itemlistfour
            );
            let uniqueArray = removeDuplicatesByKey(mergedArray);

            console.log(uniqueArray);
            //create div
            let template = "";
            document.getElementById("listofusers").innerHTML = "";
            uniqueArray.map((item) => {
              if (item.doc.email == me.email) {
              } else {
                console.log(item);
                let card = document.createElement("div");
                card.classList.add("col-6");
                card.classList.add("pe-2");
                let link = document.createElement("a");
                link.classList.add("card");
                link.classList.add("card-style");
                link.classList.add("mx-0");
                link.classList.add("mb-3");
                link.setAttribute("data-card-height", "150");
                link.style.height = "40vh";
                link.style.backgroundImage = `url('${item.doc.avatar}')`;
                //card
                let cardbottom = document.createElement("div");
                cardbottom.classList.add("card-bottom");
                cardbottom.classList.add("ps-3");
                //h1
                let heading = document.createElement("h1");
                heading.classList.add("color-white");
                heading.classList.add("mb-n1");
                heading.classList.add("font-14");
                heading.textContent = item.doc.fullname;
                //h1append
                //paragaraph
                let para = document.createElement("p");
                para.classList.add("color-white");
                para.classList.add("opacity-50");
                para.classList.add("mb-0");
                para.classList.add("font-11");
                para.classList.add("mt-n2");
                para.textShadow = "2px 2px #ff0000";
                para.textContent = item.doc.country + ", " + item.doc.state;
                //link
                cardbottom.appendChild(heading);
                cardbottom.appendChild(para);
                link.appendChild(cardbottom);
                card.appendChild(link);
                card.addEventListener("click", function () {
                  // delete item.doc.password;
                  //remove if existed before
                  try {
                    localStorage.removeItem("visitingprofile");
                  } catch (error) {}
                  //store twice
                  localStorage.setItem(
                    "visitingprofile",
                    JSON.stringify(item.doc)
                  );
                  localStorage.setItem(
                    "visitingprofile",
                    JSON.stringify(item.doc)
                  );
                  //redirect to view the persons profile
                  location.assign("/visitprofile.html");
                });
                document.getElementById("listofusers").appendChild(card);
              }
            });
          }
        })
        .catch(function (err) {});

      //find users
    });
} catch (error) {}
function getFriendslist() {
  try {
    let friendlist = JSON.parse(localStorage.getItem("loggedinuser")).friends;
    console.log(friendlist);

    if (friendlist.length > 0) {
      friendlist.map(async (item) => {
        // GET THE PERSONS INFORMATION
        await Usersdb.get(item.friend)
          .then(function (doc) {
            console.log(doc);
            // handle doc
            let link = document.createElement("a");
            link.classList.add("d-flex");
            link.classList.add("mb-3");

            let content = `  <div>
                    <img src="${doc.avatar}" style="object-fit:cover;" width="60" height="60" class="rounded-xl me-3">
                </div>
                <div>
                    <h5 class="font-16 font-600">${doc.fullname}</h5>        <p class="line-height-s mt-1 opacity-70">Tap
                    here to continue secret conversation with this person.</p>
                </div>
                <div class="align-self-center ps-3">
                    <i class="fa fa-angle-right opacity-20"></i>
                </div>`;
            link.innerHTML = content;
            /* ----------------------------------- set person you selected ---------------------------------- */
            link.addEventListener("click", function () {
              localStorage.setItem("activechat", JSON.stringify(doc));
              localStorage.setItem("activechat", JSON.stringify(doc));
              location.assign("messages.html");
            });
            /* ------------------------------------ add the list divider ------------------------------------ */
            let divider = document.createElement("div");
            divider.classList.add("divider");
            divider.classList.add("mb-3");

            document.getElementById("friendslist").appendChild(link);
            document.getElementById("friendslist").appendChild(divider);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    } else {
      document.getElementById(
        "friendslist"
      ).innerHTML = `<p>No friends yet , simply search for a person <br/> and send a message</p>`;
    }
  } catch (error) {}
}
getFriendslist();

const inputFiletwo = document.getElementById("file-inputtwo");
try {
  // listen for change in file
  inputFiletwo.addEventListener("change", function (event) {
    let theuser = JSON.parse(localStorage.getItem("loggedinuser"));
    Notiflix.Loading.standard("Uploading Image Please Wait.");
    const selectedFile = event.target.files[0]; // Assuming a single file input

    if (selectedFile) {
      let fullurl = "";
      const reader = new FileReader();

      reader.onload = async function (e) {
        const base64Data = e.target.result; // Get the Base64 data
        console.log(base64Data);
        // Make a POST request to avatar.getknacks.com with the Base64 data
        const apiUrl = "https://avatar.getknacks.com"; // Replace with the actual API endpoint
        const requestData = { imagefile: base64Data }; // Replace with any other required data

        await fetch(apiUrl, {
          method: "POST",

          body: JSON.stringify(requestData),
        })
          .then((response) => response.json())
          .then((data) => {
            //remove loader
            Notiflix.Loading.remove();
            //baseurl
            let baseurl = `https://avatar.getknacks.com/images/${data.data}`;
            let thecurrentchat = JSON.parse(localStorage.getItem("activechat"));

            // GENERATE MESSAGE ID
            let messageid = concatenateEmails(
              theuser.email,
              thecurrentchat.email
            );

            // setupthefullimage
            let themessage = Messagessingle;
            themessage._id = messageid;
            themessage.senderid = theuser.email;
            themessage.receiverid = thecurrentchat.email;
            themessage.message = document.getElementById("themessage").value;
            themessage.attachment = baseurl;
            themessage.date_added = getCurrentDate();
            themessage.time_added = getCurrentTime();

            //uploadtheimagge
            Messagesdb.get(messageid)
              .then(function (doc) {
                console.log(doc);

                let newmessage = doc;
                newmessage._id = messageid;
                newmessage._rev = doc._rev;
                newmessage.messages.push(themessage);
                /* ------------------------------------- MESSAGES CREATE NEW ------------------------------------ */
                Messagesdb.put(newmessage).then(function (doc) {
                  document.getElementById("themessage").value = "";
                  //doc output here
                  LoadCurrentChats();
                });
              })
              .then(function (response) {
                // handle response
                console.log(response);
              })
              .catch(function (err) {
                // console.log(err);
                let newmessage = Messages;
                newmessage._id = messageid;
                newmessage.messages = [];
                newmessage.messages.push(themessage);
                /* ------------------------------------- MESSAGES CREATE NEW ------------------------------------ */
                Messagesdb.put(newmessage).then(function (doc) {
                  //doc output here
                  window.scrollTo(0, document.body.scrollHeight);
                  document.getElementById("themessage").value = "";
                  LoadCurrentChats();
                });
              });
          })
          .catch((error) => {
            //remove loader
            Notiflix.Loading.remove();
            Notiflix.Report.failure("Error Occured", error.toString());
            console.error("Error:", error);
            // Handle errors
          });
      };

      // Read the selected file as Data URL (which includes Base64 data)
      reader.readAsDataURL(selectedFile);
    }
  });
} catch (error) {}

const removeChat = (e) => {
  let key = e.getAttribute("data-key");
  let convoid = e.getAttribute("data-conversation");

  Messagesdb.get(convoid)
    .then(function (doc) {
      console.log(doc);
      Notiflix.Confirm.show(
        "Delete Confirmation",
        "Do you wish to delete this message?",
        "Yes",
        "No",
        () => {
          let allmessages = doc;
          allmessages.messages.splice(key, 1);
          allmessages._id = doc._id;
          allmessages._rev = doc._rev;
          Messagesdb.put(allmessages);
          LoadCurrentChats();
        },
        () => {},
        {}
      );
      //  return db.put({
      //    _id: "mydoc",
      //    _rev: doc._rev,
      //    title: "Let's Dance",
      //  });
    })
    .then(function (response) {
      // handle response
    })
    .catch(function (err) {
      console.log(err);
    });
};

/* --------------------------------- SEND OTP FOR PASSWORD RESET -------------------------------- */
try {
  document.getElementById("sendotpnow").addEventListener("click", function () {
    Notiflix.Loading.standard("Please wait loading....");
    let emailaddress = document.getElementById("emailaddress").value;
    const otp = Math.floor(Math.random() * 90000) + 10000;
    sessionStorage.setItem(
      "otpsession",
      JSON.stringify({ email: emailaddress, otp: otp })
    );
    sessionStorage.setItem(
      "otpsession",
      JSON.stringify({ email: emailaddress, otp: otp })
    );
    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "noreply@getknacks.com",
      Password: "EF0CA83A2FB9BCA3BE9758693D5E807AFA2A",
      To: emailaddress,
      From: "info@getknacks.com",
      Subject: "OTP VERIFICATION",
      Body: `Your Otp verification code is ${otp}`,
    })
      .then((message) => {
        Notiflix.Loading.remove();
        Notiflix.Confirm.show(
          "OTP SENT",
          "OTP  SENT SUCCESSFULLY PLEASE CHECK INBOX OR SPAM. SOME EMAIL PROVIDERS HAVE ISSUES WITH SMTP",
          "Okay",
          "Cancel",
          () => {
            location.assign("otp.html");
          },
          () => {
            //nothing
          },
          {}
        );
      })
      .catch((err) => {
        Notiflix.Loading.remove();
        Notiflix.Report.failure(
          "Notification",
          "Could not send OTP an error occured."
        );
      });
  });
} catch (error) {}

try {
  document.getElementById("verifyotp").addEventListener("click", function () {
    Notiflix.Loading.standard("Please wait Loading...");
    let history = sessionStorage.getItem("otpsession");
    //history
    history = JSON.parse(history);
    let allotp = document.getElementsByClassName("otp");
    //providedotp
    let providedotp = "";
    for (x = 0; x < allotp.length; x++) {
      providedotp += allotp[x].value;
    }

    console.log(providedotp);
    if (providedotp == history.otp) {
      Notiflix.Confirm.show(
        "OTP CONFIRMED",
        "OTP HAS BEEN CONFIRMED CORRECT,CLICK OKAY TO RESET PASSWORD",
        "Okay",
        "Cancel",
        () => {
          location.assign("reset.html");
        },
        () => {
          //nothing
        },
        {}
      );
    } else {
      Notiflix.Loading.remove();
      Notiflix.Report.failure(
        "Notification",
        "Could not verify otp, Wrong otp provided..."
      );
    }
  });
} catch (error) {}

try {
  document
    .getElementById("createnewpassword")
    .addEventListener("click", function () {
      //history
      let history = sessionStorage.getItem("otpsession");
      //history
      history = JSON.parse(history);
      //new details
      var password = document.getElementById("password").value;
      var newpassword = document.getElementById("newpassword").value;

      if (password == newpassword) {
        Usersdb.get(history.email)
          .then(function (doc) {
            doc.password = password.trim();
            doc._id = doc._id;
            doc._rev = doc._rev;
            return Usersdb.put(doc);
          })
          .then(function (response) {
            // handle response
            Notiflix.Loading.remove();
            Notiflix.Confirm.show(
              "PASSWORD CHANGED",
              "Password has been changed successfully.....",
              "Okay",
              "Cancel",
              () => {
                location.assign("login.html");
              },
              () => {
                //nothing
              },
              {}
            );
          })
          .catch(function (err) {
            Notiflix.Loading.remove();
            Notiflix.Report.failure("Notification", "An erroroccured" + err);
            console.log(err);
          });
      } else {
        Notiflix.Loading.remove();
        Notiflix.Report.failure(
          "Notification",
          "Passwords provided do not match"
        );
      }
    });
} catch (error) {}
function Notifyme() {
  try {
    if (Notification.permission !== "granted") {
    } else {
      // request user grant to show notification
      navigator.serviceWorker.register("sw.js");
      Notification.requestPermission(function (result) {
        if (result === "granted") {
          navigator.serviceWorker.ready.then(function (registration) {
            Notiflix.Notify.success("Notifications are Active");
            // registration.showNotification("Notifications Are Active");
          });
        }
      });
    }
  } catch (w) {}
}
Notifyme();
function CheckNewMessages() {
  let me = JSON.parse(localStorage.getItem("loggedinuser"));
  let idarray = [];
  me.friends.map((item) => {
    idarray.push(concatenateEmails(me.email, item.friend));
  });
  console.log(idarray);

  try {
    Messagesdb.changes({
      since: "now",
      live: true,
      include_docs: true,
      doc_ids: idarray,
    })
      .on("change", function (change) {
        // handle change
        let notificationitem = change.doc;
        specificmessage = notificationitem.messages.slice(-1);
        console.log(specificmessage);
        //check if it was me that sent message
        if (specificmessage[0].senderid == me.email) {
          console.log("its you that sent message so ignore");
          // get the persons info
        } else {
          console.log("someone sent you a new message");
          // GET THE PERSON AND SEND THE MESSAGE
          Usersdb.get(specificmessage[0].senderid)
            .then(function (response) {
              let person = response;
              // SEND A NOTIFICATION
              navigator.serviceWorker.register("sw.js");
              Notification.requestPermission(function (result) {
                if (result === "granted") {
                  navigator.serviceWorker.ready.then(function (registration) {
                    registration.showNotification(
                      `New Message from: ${person.fullname}.`,
                      {
                        body: specificmessage[0].message,
                        // data: { hello: "world" },
                      }
                    );
                  });
                }
              });
              //  SEND A NOTIFICATION
            })
            .catch(function (e) {});
        }
      })
      .on("complete", function (info) {
        // changes() was canceled
      })
      .on("error", function (err) {
        console.log(err);
      });
  } catch (error) {}
}
CheckNewMessages();

setTimeout(function () {
  Notifyme();
}, 2000);
