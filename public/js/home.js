let iBtn = document.getElementById('iBtn');
let list = document.querySelectorAll(".navigation li");


// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");


const environment = "Local";
//const environment = "Production";

const LOCAL_AWS_APIURL = 'http://3.109.143.245:4000';
const LOCAL_WINDOWS_APIURL =  'http://localhost:4000';




//TODO - Fetching current user info
async function getCurrentUser() {

  try {
  
    let apiURL = `${getAPIURL()}/user/current-user`;
    console.log(`URL : ${apiURL}`);
  
    const response = await axios.get(apiURL, getHeaders());
    if (response.status === 200) {
       
        let userObj = response.data.data;
        
        document.querySelector('#i_display_name').value = userObj.name;
        document.querySelector('#i_display_type').value = userObj.ispremiumuser ? 'Premium-User' : 'Normal-User';
        document.querySelector('#i_display_email').value = userObj.email;
        document.querySelector('#i_display_totalIncome').value = userObj.totalincome;
        document.querySelector('#i_display_totalExpense').value = userObj.totalexpense;

        const profileDisplayModal = new bootstrap.Modal(document.getElementById('profileDisplay'));
        profileDisplayModal.show();
      
    } else {
        throw new Error("No user-information to display.");
    }
  
  } catch (err) {
    document.querySelector("#errorAlert").innerText = `${err.response.data.message}`;
    alertAwakeSleep();
    throw new Error(err);
  }

}




iBtn.addEventListener('click', function(event) {
  event.preventDefault();
  getCurrentUser();
});







//!Homework - Make Below Code Modular
//TODO - set headers and token
getHeaders = () => {
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
getAPIURL = () => {

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





function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));




toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};


