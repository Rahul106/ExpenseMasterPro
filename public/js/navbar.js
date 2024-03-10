// const LOCAL_AWS_APIURL = 'http://3.109.143.245:4000';
// const LOCAL_WINDOWS_APIURL = 'http://localhost:4000';


const logoutBtn = document.getElementById("logoutBtn");
const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  navbartoggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");



  
// async function buyPremium() {

//   console.log('-----Buy-Premium-----');

//   try {

//     const response = await axios.get(`${LOCAL_WINDOWS_APIURL}/purchase/premiumMember`, getHeaders())
//     console.log(`Response-Data-Order-Id : ${response.data.status}`);
    
//       // Create the payment handler function
//       var paymentcreds = { 
      
//         "key": response.data.key_id,
//         "order_id": response.data.order.id,
//         "handler": async function (response) {
      
//           try {
        
//             // Make a POST request to update the transaction status
//             const res = await axios.post(`${LOCAL_WINDOWS_APIURL}/purchase/updateTransactionStatus`, {
//             order_id: paymentcreds.order_id,
//             payment_id: response.razorpay_payment_id,
//            }, getHeaders());
        
//             //premiumUserMsg();
//             alert('Your Premium Membership is now active'); 
//             localStorage.setItem('token',res.data.token)
//             //showLeaderBoard();  
//             //showDownloadsHistory();
      
//           } catch (err) {
//             console.error(err);
//             throw new Error(err);
//           }

//       }
//     }  
  
    
//     // Create the Razorpay instance and open the payment modal
//     const razorPayModel = new Razorpay(paymentcreds);
//     razorPayModel.open();
    
//     razorPayModel.on('payment.failed', async (response) => {
      
//       try {

//         alert(`Alert: ${response.error.description}`)
        
//       } catch (error) {
//         console.log(error)
//         alert(`Payment failed due to ${error.error.description}`);
//       }
      
//     });

//   } catch (err) {
//     console.log(err);
//     alert('Something went wrong last line. Please try again.');
//     throw new Error(err);
//   }

// }




//logout
function logout() {

    console.log("Logging out...");
    localStorage.removeItem('token');
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



// premiumBtn.addEventListener('click', function(event) {
//   event.preventDefault();
//   buyPremium();
// });



// //set headers and token
// function getHeaders() {

//     const token = localStorage.getItem('token');
//     const headers = {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': token
//         }
//     };

//     return headers;
// }



