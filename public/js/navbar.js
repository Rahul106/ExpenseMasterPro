const LOCAL_AWS_APIURL = 'http://3.109.143.245:4000';
const LOCAL_WINDOWS_APIURL = 'http://localhost:4000';


const logoutBtn = document.getElementById("logoutBtn");
const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");



  
function buyPremium() {

  console.log('-----Buy-Premium-----');

  axios.get(`${LOCAL_WINDOWS_APIURL}/purchase/premium`, getHeaders())
        .then((response) => {
          
          console.log('--------------------------------------------------------'+response.data.order.id);
          var paymentcreds = {
            //'name' : 'Expensify',
            //'description' : 'Buying-Premium',
            'key': response.data.key_id,
            'order_id': response.data.order.id,
            'handler': async (response) => {
        
              const respMsg = await axios.post(`${LOCAL_WINDOWS_APIURL}/purchase/updateTransactionStatus`, {
                order_id: paymentcreds.order_id,
                payment_id: response.razorpay_payment_id
                }, getHeaders());

                alert(respMsg.data.message);
                //showPremiumFeatures();
              },
          };

          const rzp = new Razorpay(paymentcreds);
          rzp.open();

          rzp.on('payment.failed', (response) => {

            const orderId = response.error.metadata.order_id;

            axios.post(`${LOCAL_WINDOWS_APIURL}/purchase/updateTransactionStatus`, { status: 'FAILED', order_id: orderId }, getHeaders())
              .then((resp) => {
                  alert(resp.data.message)
                }).catch((err) => {
                  console.log(err);
                })
           })

        }) .catch((err) => {
            alert(err.response.data.message);
        })

        console.log('-----Buy-Premium-----');

}




//logout
function logout() {

    console.log("Logging out...");
    localStorage.removeItem('token');
    return window.location.href = '/logout';  

}



toggle.addEventListener("click", () => {
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



premiumBtn.addEventListener('click', function(event) {
  event.preventDefault();
  buyPremium();
});



//set headers and token
function getHeaders() {

    const token = localStorage.getItem('token');
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };

    return headers;
}