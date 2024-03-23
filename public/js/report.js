const reportBtn = document.getElementById("reportBtn");
const downloadReportsBtn = document.getElementById("downloadReportsBtn");
const premiumSection = document.getElementById('premiumSection');
const sections = document.querySelector(".p-3");





async function downloadHistory() {

  try {

    const response = await axios.get(`${getAPIURL()}/premium/get-history`, getHeaders());
    addToHistoryTable(response.data.prevDownloads);
    
  } catch(err) {
    console.log("error in fetching report from server. ",err)
    document.querySelector('.error-textMsg').innerText=`Server error- ${err.message} ,in Downloading report. Please Retry after sometime.`;
    document.querySelector('#error-alert').classList.toggle("hidden")
  }

}




//TODO - downloads reports
async function downloadReports(){

  try {

    const response = await axios.get(`${getAPIURL()}/premium/downloadExpenseReports`, getHeaders());
    
    if(response.status === 200) {
        const link = document.createElement("a");
        link.href = response.data.fileUrl;
        link.download = 'ExpenseReport.json';
        link.click();
    } else {
      console.log("issue in fetching report.");
      throw new Error(`Facing some issue. Try after Sometime.. ${response.data.message}`)
    }

    } catch(err) {
      console.log("error in fetching report from server. ",err)
      document.querySelector('.error-textMsg').innerText=`Server error- ${err.message} ,in Downloading report. Please Retry after sometime.`;
      document.querySelector('#error-alert').classList.toggle("hidden")
    }

  }




function showPremiumSections() {

  premiumSection.style.display = 'block';

}



function showTextForNonPremium() {
  
  const premiumText = document.createElement('p');
  premiumText.textContent = 'To enable this feature, please buy a premium subscription.';
  premiumSection.appendChild(premiumText);

}



function showPremiumFeatures() {
  
  document.getElementById('non premium report').remove();
  //document.getElementById('reportBtn').display();
  //document.getElementById('downloadReportsBtn').display('downloadReportsBtn').display();

}




function hidePremiumFeatures() {
    
  document.getElementById('reportBtn').remove();
  document.getElementById('downloadReportsBtn').remove('downloadReportsBtn');
 

}



document.addEventListener('DOMContentLoaded', async() => {

    try {

      const response = await axios.get(`${getAPIURL()}/premium/status`, getHeaders())
      
      if(response.status === 200) {
        if(response.data.isPremiumUser) {
          showPremiumFeatures();
        } else {
          hidePremiumFeatures();
        }
      } 

    } catch(error) {
      console.log(error);
    }

});




downloadReportsBtn.addEventListener('click', function(event) {
  event.preventDefault();
  downloadReports();
});



reportBtn.addEventListener('click', function(event) {
  event.preventDefault();
  downloadHistory();
});



function addToHistoryTable(files) {
  const table = document.getElementById('historyTable');
  table.innerHTML = '';

  // Create thead element
  const thead = document.createElement('thead');
  thead.className = 'table-danger';

  const headTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Your Download History';
  th.setAttribute('scope', 'col');
  headTr.appendChild(th);
  thead.appendChild(headTr);
  table.appendChild(thead);

  // Create tbody element
  const tbody = document.createElement('tbody');

  for (let i = 0; i < files.length; i++) {
      const formattedDateTime  = formatDateTime(files[i].updatedAt);

      // Create a new anchor element
      const a = document.createElement('a');
      a.href = files[i].fileUrl;
      a.download = 'myExpense.csv';
      a.textContent = formattedDateTime;

      // Create a new table cell and append the anchor element
      const td = document.createElement('td');
      td.appendChild(a);

      // Create a new table row and append the table cell
      const tr = document.createElement('tr');
      tr.appendChild(td);

      // Append the table row to the tbody
      tbody.appendChild(tr);
  }

  // Append the tbody to the table
  table.appendChild(tbody);
}




function formatDateTime(dateTimeString) {

  const updatedAtDate = new Date(dateTimeString);

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
  }).format(updatedAtDate);

  return formattedDate;

}