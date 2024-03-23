const logoutBtn = document.getElementById("logoutBtn");
const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  navbartoggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");





//logout
function logout() {

    console.log("Logging out...");
    localStorage.removeItem('token');
    localStorage.clear();
    return window.location.href = '/logout';  

}



navbartoggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});



searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});



modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});



logoutBtn.addEventListener("click", function(event) {
  event.preventDefault();
  logout();
});


