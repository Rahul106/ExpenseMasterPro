//const AWS = require('aws-sdk');
const LOCAL_WINDOWS_APIURL = 'http://3.109.143.245:4000';
const LOCAL_AWS_APIURL = 'http://localhost:4000';
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const hideMenuBtn = navbarMenu.querySelector(".close-btn");


document.getElementById("i_signInForm").addEventListener("submit", async (e) => {
  e.preventDefault();
 
  try {
  
  const email = e.target.n_email.value;
  const password = e.target.n_password.value;

  if(!email.trim()) {
    document.querySelector("#errorAlert").innerText = `Kindly fill email field.!!!`;
    return alertAwakeSleep();;
  }

  if(!password.trim()) {
    document.querySelector("#errorAlert").innerText = `Kindly fill password field.!!!`;
    return alertAwakeSleep();
  }
  
    const loginObj = {email, password};

    let apiURL = "";
    if (isAWSRegion()) {
      apiURL = LOCAL_WINDOWS_APIURL;
    } else {
      apiURL = LOCAL_AWS_APIURL;
    }
  
    apiURL = `${apiURL}/user/login`;
    console.log(`URL : ${apiURL}`);

    const response = await axios.post(apiURL, loginObj);
    if (response.status === 200) {

      console.log(response.data.message);
      window.location.href = "/home";
      e.target.n_email.value = '';
      e.target.n_password.value = '';
    
    } else {
      throw new Error("Error in credentials");
    }

} catch (err) {
  document.querySelector("#errorAlert").innerText = `${err.response.data.message}`;
  alertAwakeSleep();
  throw new Error(err);
}

});



async function addNewUser(uObj) {

  console.log(`user-object : ${uObj}`);

  let apiURL = "";
  
  if (isAWSRegion()) {
    apiURL = LOCAL_WINDOWS_APIURL
  } else {
    apiURL = LOCAL_AWS_APIURL
  }

  apiURL = `${apiURL}/user/signup`;
  console.log(`URL : ${apiURL}`);

  try {

    const response = await axios.post(apiURL, uObj);
    console.log("user created : ", response.data);

    if (response.status === 201) {
      document.querySelector("#successAlert").innerText = `${response.data.userAddedResponse}`;
      successAlertAwakeSleep();
      location.reload();
    } else {
      throw new Error("Error creating user");
    }

  } catch (error) {
    console.log(`error in adding user :  ${error}`);
    document.querySelector("#errorAlert").innerText = `${error.response.data.message}`;
    alertAwakeSleep();
  }

}



document.getElementById("si_userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.sn_name.value;
  const email = e.target.sn_email.value;
  const password = e.target.sn_password.value;

  if (!name) {
    document.querySelector("#errorAlert").innerText = 'Please fill name field.';
    return alertAwakeSleep();
  } else if (!email) {
    document.querySelector("#errorAlert").innerText = 'Please fill email field.';
    return alertAwakeSleep();
  } else if (!password) {
    document.querySelector("#errorAlert").innerText = 'Please fill password field.';
    return alertAwakeSleep();
  }

  console.log("name : ", name);
  console.log("email : ", email);

  const userObject = {
    name: name,
    email: email,
    password: password,
  };

  addNewUser(userObject);

});



registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});



loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});


// Show mobile menu
hamburgerBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("show-menu");
  container.style.display = "none";
});


// Hide mobile menu
hideMenuBtn.addEventListener("click", () => {
  hamburgerBtn.click();
  container.style.display = "block";
});


function isAWSRegion() {
  // Check if the AWS SDK configuration has a region set
  //return !!AWS.config.region;
  return false;
}


function alertAwakeSleep() {
  document.querySelector("#errorAlert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("errorAlert").classList.toggle("hidden");
  }, 1500);
}


function  successAlertAwakeSleep() {
  document.querySelector("#successAlert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("successAlert").classList.toggle("hidden");
  }, 2000);
}