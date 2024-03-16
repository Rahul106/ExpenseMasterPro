const environment = "Local";
//const environment = "Production";



const LOCAL_AWS_APIURL = 'http://3.109.143.245:4000';
const LOCAL_WINDOWS_APIURL =  'http://localhost:4000';
let resetBtn = document.getElementById('resetBtn');



async function forgetPasswordLink(e) {
    e.preventDefault();

    try {
      
        const email = document.getElementById('i_email').value;
      
        if(!email.trim()) { 
            return alert('Please enter your correct email')
        }

        console.log(`Email : ${email}`);
        const result = await axios.post(`${getAPIURL()}/password/forgotpassword`, {email})
        document.getElementById('i_email').value = '';
        document.body.innerHTML += `<div style="color:green;">${result.data.message}<div>`
    
    } catch(err) {
        console.log(err)
        document.body.innerHTML += '<div style="color:red;">${err} <div>'
    }

}




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




resetBtn.addEventListener('click', function(event) {
    event.preventDefault();
    forgetPasswordLink(event);
});