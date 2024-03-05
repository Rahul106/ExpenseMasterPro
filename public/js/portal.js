const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const hideMenuBtn = navbarMenu.querySelector(".close-btn");


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
  


function togglePasswordVisibility() {

    const passwordInput = document.getElementById("i_password");
    const toggleIcon = document.querySelector(".toggle-password");
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.classList.remove("fa-lock");
      toggleIcon.classList.add("fa-unlock-alt");
    } else {
      passwordInput.type = "password";
      toggleIcon.classList.remove("fa-unlock-alt");
      toggleIcon.classList.add("fa-lock");
    }
  
  }
  

  
  function togglePasswordVisibilitys() {
    
    const passwordInput = document.getElementById("si_password");
    const toggleIcon = document.querySelector(".toggle-passwords");
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.classList.remove("fa-lock");
      toggleIcon.classList.add("fa-unlock-alt");
    } else {
      passwordInput.type = "password";
      toggleIcon.classList.remove("fa-unlock-alt");
      toggleIcon.classList.add("fa-lock");
    
    }

  }
  
  