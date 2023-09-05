/* --------------------------------- CHEKC IF USER IS LOGGED IN --------------------------------- */
var user = {};
if (localStorage.getItem("loggedinuser")) {
  /* ---------------------------------------------------------------------------------------------- */
  /*                             CARRY OUT OTHER CHECKS RELATED TO USER                             */
  /* ---------------------------------------------------------------------------------------------- */
function demgofeelit(){
  /* ----------------------------------- store user in variable ----------------------------------- */
  user = JSON.parse(localStorage.getItem("loggedinuser"));
  /* ------------------------------ NO 1: CHECK IF USER HAS AN  IF THEY DO CHECK SOMETHING ELSE IF THEY DONT TAKE THEM TO UPDATING THEIR PROFILE ----------------------------- */

  if (page == "editprofile") {
    Notiflix.Notify.warning("Tap on the upload button to upload new Avatar.");
    //username
    document.getElementById("usereditprofile").innerHTML = `${
      user.fullname.split(" ")[0]
    } <br> ${user.fullname.split(" ")[1]}`;

    //userlocation
    if (user.country != "") {
      document.getElementById(
        "userloco"
      ).innerHTML = `${user.country} , ${user.state}`;
    }
    //email address
    document.getElementById("emailaddress").value = user.email;

    //firstname
    document.getElementById("firstname").value = user.fullname.split(" ")[0];

    //lastname
    document.getElementById("lastname").value = user.fullname.split(" ")[1];

    //location
    document.getElementById("country").value = user.country;
    document.getElementById("state").value = user.state;
    document.getElementById("city").value = user.city;
    document.getElementById("bio").innerHTML = `${user.bio}`;

    //fill bio
    document.getElementById("biotwo").value = `${user.bio}`;

    //if avatar exists fill avatar
    if (user.avatar !== "") {
      document.getElementById(
        "profileimage"
      ).style.backgroundImage = `url('${user.avatar}')`;
      document.getElementById("profileimage").style.backgroundPosition =
        "center";
      document.getElementById("profileimage").style.backgroundSize = "cover";
    }
  } else {
    /* ------------------------------ EDIT PROFILE PAGE FUNCTIONS ABOVE ----------------------------- */
    /* ----------------------------------------- OTHER STUFF ---------------------------------------- */
    if (user.avatar == "" || user.bio == "") {
      Notiflix.Report.warning(
        "Update Profile",
        "Upload your Avatar and Bio information so people can connect with you easily(COMPULSORY)."
      );
      setTimeout(function () {
        location.assign("editprofile.html");
      }, 2000);
    } else {
    }

    /* ----------------------------------------- OTHER STUFF ---------------------------------------- */
  }
}

demgofeelit();
  /* ---------------------------------------------------------------------------------------------- */
  /*                             CARRY OUT OTHER CHECKS RELATED TO USER                             */
  /* ---------------------------------------------------------------------------------------------- */
} else {
  Notiflix.Notify.failure("Sorry, You are not logged in");
  setTimeout(function () {
    location.assign("/login.html");
  }, 1500);
}
