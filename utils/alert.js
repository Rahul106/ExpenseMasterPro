// utils/alertUtils.js

function alertAwakeSleep() {
    document.querySelector("#errorAlert").classList.toggle("hidden");
    setTimeout(function () {
      document.getElementById("errorAlert").classList.toggle("hidden");
    }, 1500);
  }
  
  function successAlertAwakeSleep() {
    document.querySelector("#successAlert").classList.toggle("hidden");
    setTimeout(function () {
      document.getElementById("successAlert").classList.toggle("hidden");
    }, 2000);
  }
  
  module.exports = { alertAwakeSleep, successAlertAwakeSleep };
  