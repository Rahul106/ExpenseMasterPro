
const premiumBtn = document.getElementById("premiumBtn");
const leaderBtn = document.getElementById("leaderBtn");
const section = document.querySelector(".p-3");
const buttonContainer = document.getElementById('buttonContainer');




//TODO - buy premium
async function buyPremium() {

    console.log('-----Buy-Premium-----');
  
    try {
  
      const response = await axios.get(`${getAPIURL()}/purchase/premiumMember`, getHeaders())
      console.log(`Response-Data-Order-Id : ${response.data.order.status}`);
      
        var paymentcreds = { 
            
          "key": response.data.key_id,
          "order_id": response.data.order.id,
          "handler": async function (response) {
        
            try {
              const res = await axios.post(`${getAPIURL()}/purchase/updateTransactionStatus`, {
              order_id: paymentcreds.order_id,
              payment_id: response.razorpay_payment_id,
             }, getHeaders());
          
              alert('Your Premium Membership is now active'); 
              localStorage.setItem('token', res.data.token)
  
              showPremiumFeatures();
              setTimeout(logout, 3000);
              //premiumUserMsg();
              //showLeaderBoard();  
              //showDownloadsHistory();
        
            } catch (err) {
              console.error(err);
              throw new Error(err);
            }
  
        }
      }  
    
      
      const razorPayModel = new Razorpay(paymentcreds);
      razorPayModel.open();
      
      razorPayModel.on('payment.failed', async (response) => {
        
        try {
  
          alert(`Alert: ${response.error.description}`)
          
        } catch (error) {
          console.log(error)
          alert(`Payment failed due to ${error.error.description}`);
        }
        
      });
  
    } catch (err) {
      console.log(err);
      alert('Something went wrong last line. Please try again.');
      throw new Error(err);
    }
  
  }
  


//TODO - show leaderboard
async function showLeaderBoard() {

  console.log('-----Show-LeaderBoard-----');

  try {

    const response = await axios.get(`${getAPIURL()}/premium/get-leaderboard`, getHeaders());
    segregateData(response);

  } catch (err) {
    console.log(err);
    alert('Something went wrong last line. Please try again.');
    throw new Error(err);
  }

  console.log('-----Show-LeaderBoard-----');

}




async function showLeaderInfo(element,  index) {  

  let createElement = `<tr class='expenseDetail'>
    <td data-title="S.No">${index + 1}</td>
      <td data-title="Expense Name">${element.name}</td>      
      <td data-title="Expense Amount">${element.totalAmount}</td>
    </tr>`
  
  leaderData.innerHTML += createElement;

}




//TODO - segregate data
function segregateData(resp) {

  console.log('------Response-Data-----'+resp.data);

  leaderData.innerHTML = "";
  if(resp.data) {
      resp.data.forEach((elem, indx) => {
        showLeaderInfo(elem, indx);
      });
  }

}





function createLeaderboardButton() {

  const leaderboardButton = document.createElement('button');
 
  leaderboardButton.classList.add('btn', 'btn-primary', 'btn-lg');
  leaderboardButton.id = 'leaderBtn';
  leaderboardButton.innerHTML = 'View Leaderboard <i class="bi bi-award-fill"></i>';
  buttonContainer.appendChild(leaderboardButton);
  
  leaderboardButton.addEventListener('click', () => {
    console.log('View Leaderboard button clicked');
    showLeaderBoard();
  });

}




function showPremiumFeatures() {
  
  createLeaderboardButton();

}





function showNormalFeatures() {

  const premiumButton = document.createElement('button');

  premiumButton.classList.add('btn', 'btn-primary', 'btn-lg');
  premiumButton.id = 'premiumBtn';
  premiumButton.innerHTML = 'Buy Premium <i class="bi bi-cash"></i>';
  buttonContainer.appendChild(premiumButton);

  premiumButton.addEventListener('click', () => {
    console.log('Buy Premium button clicked');
    buyPremium();
  });

}




document.addEventListener('DOMContentLoaded', async() => {

  try {

    const response = await axios.get(`${getAPIURL()}/premium/status`, getHeaders())
      
    if(response.status === 200) {
      if(response.data.isPremiumUser) {
        showPremiumFeatures();
      } else {
        showNormalFeatures();
      }
    } 

  } catch(error) {
    console.log(error);
  }

});




  




  