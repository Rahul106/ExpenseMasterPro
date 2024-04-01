let signIn = document.getElementById("i_signInForm");
let signUp = document.getElementById('si_userForm');


//const environment = "Local";
const environment = "Production";

const LOCAL_AWS_APIURL = 'http://44.212.45.234:4000';
const LOCAL_WINDOWS_APIURL =  'http://localhost:4000';





//TODO - userLogin
async function userLogin(e) {
  
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
   
    let apiURL = `${getAPIURL()}/user/login`;
    console.log(`URL : ${apiURL}`);
  
    const response = await axios.post(apiURL, loginObj);
    if (response.status === 200) {
  
      localStorage.setItem('token', response.data.token)
      alert(response.data.message);
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

}





//TODO - add new user
async function addNewUser(uObj) {

  console.log(`user-object : ${uObj}`);

  let apiURL = `${getAPIURL()}/user/signup`;
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




//TODO - user-registration process
function userRegistration(e) {

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

}
  



//!Homework - Make Below Code Modular
//TODO - set headers and token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  };

  return headers;
};




//TODO - check Local/Production
const getAPIURL = () => {

  if (environment.toUpperCase() === 'LOCAL') {
    return LOCAL_WINDOWS_APIURL;
  } else if (environment.toUpperCase() === 'PRODUCTION') {
    return LOCAL_AWS_APIURL;
  } else {
    throw new Error('Invalid environment specified');
  }

};



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




signIn.addEventListener('submit', function(event) {
  event.preventDefault();
  userLogin(event);
});




signUp.addEventListener('submit', function(event) {
  event.preventDefault();
  userRegistration(event);
});


