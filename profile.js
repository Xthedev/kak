user = JSON.parse(localStorage.getItem("loggedinuser"));
document.getElementById("usereditprofile").innerHTML = `${
  user.fullname.split(" ")[0]
} <br> ${user.fullname.split(" ")[1]}`;

//userlocation
if (user.country != "") {
  document.getElementById(
    "userloco"
  ).innerHTML = `${user.country} , ${user.state}`;
}

//if avatar exists fill avatar
if (user.avatar !== "") {
  document.getElementById(
    "profileimage"
  ).style.backgroundImage = `url('${user.avatar}')`;
  document.getElementById("profileimage").style.backgroundPosition = "center";
  document.getElementById("profileimage").style.backgroundSize = "cover";
}

//fill bio
document.getElementById("bio").innerHTML = `${user.bio}`;
document.getElementById("dcountry").innerHTML = `${user.country}`;
document.getElementById("dcity").innerHTML = `${user.city}`;
document.getElementById("dstate").innerHTML = `${user.state}`;
let themc = document.getElementsByClassName("mb-n1");
for (x = 0; x < themc.length; x++) {
  themc[x].style.fontSize = "14px"; 
}
