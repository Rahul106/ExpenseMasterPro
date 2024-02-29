class AlertUtils {

  // function to awake/sleep alert
  static alertAwakeSleep() {
    document.querySelector("#errorAlert").classList.toggle("hidden");
    setTimeout(function () {
      document.getElementById("errorAlert").classList.toggle("hidden");
    }, 1500);
  }


  static successAlertAwakeSleep() {
    document.querySelector("#successAlert").classList.toggle("hidden");
    setTimeout(function () {
      document.getElementById("successAlert").classList.toggle("hidden");
    }, 2000);
  }
  
}
