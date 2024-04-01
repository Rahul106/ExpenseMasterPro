//const environment = "Local";
const environment = "Production";


//const localPublicIP = 'http://44.212.45.234:4000';
const LOCAL_AWS_APIURL = 'http://44.212.45.234:4000';
const LOCAL_WINDOWS_APIURL =  'http://localhost:4000';

let form = document.getElementById('addExpenseForm');
let imgInput = document.querySelector('.img');
let imgFile = document.getElementById('i_imgInput');
let expNum = document.getElementById('#i_expNum');
let expCat = document.getElementById('i_expenseCategoryDropdown');
let expName = document.getElementById('i_expName');
let expDesc = document.getElementById('i_expDescription');
let expType = document.getElementById('i_transactionType');
let expAmt = document.getElementById('i_expAmount');
let expDate = document.getElementById('i_expDate');
let submitBtn = document.querySelector('.submit');
let expData = document.getElementById('expenseData');
let modal = document.getElementById('addExpenseForm');
let modalTitle = document.querySelector('#addExpenseForm .modal-title');
let newExpenseBtn = document.querySelector('.newExpense');
const dropdownItems = document.querySelectorAll('.dropdown-item');
let selectedCategory = '';


let isEdit = false;
let editId = 0;


console.log('Form' + form);
console.log('ImageInput' + imgInput);
console.log('File : ' + imgFile);
console.log('UserName : ' + expNum + expName + expAmt + expDate);
console.log('Submit : ' + submitBtn);
console.log('ExpenseData : ' + expData);
console.log('Modal : ' + modal);
console.log('ModalTitle : ' + modalTitle);
console.log('UserButton : ' + newExpenseBtn);




$(".dropdown-menu li a").click(function(){
    var selText = $(this).text();
    $(this).parents('.dropdown').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
  });



function getSelectedTransactionType() {

    var radioButtons = document.getElementsByName("n_transactionType");
    var selectedValue = "";
  
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        selectedValue = radioButtons[i].value;
        break;
      }
    }
    
    console.log("Selected Value:", selectedValue);
    return selectedValue;
}




function selectCandidate(item) {
    
    selectedCategory = item.textContent.trim();
    dropdownItems.forEach(function (element) {
        element.classList.remove("active");
    });

    item.classList.add("active");

}




function getSelectedCandidate() {
   
    if (!selectedCategory || selectedCategory.toLowerCase() === "category") {
        selectedCategory = "Others";
    }

    return selectedCategory;
}




newExpenseBtn.addEventListener('click', () => {
    submitBtn.innerText = 'Submit'
    modalTitle.innerText = 'Fill The Expense-Form ...'
    isEdit = false
    imgInput.src = '/images/Profile Icon.webp'
});




imgFile.onchange = function () {
    if (imgFile.files[0].size < 1000000) {  // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            imgUrl = e.target.result
            imgInput.src = imgUrl
        }

        fileReader.readAsDataURL(imgFile.files[0])
    } else {
        alert('This file is too large!')
    }
}




async function initPage() {

    const limit = localStorage.getItem('rowsPerPage') || 5;
    
    let apiURL = `${getAPIURL()}/expense/fetch-expenses?page=1&limit=${limit}`;
    console.log(`URL : ${apiURL}`);

    const expenseData = await axios.get(apiURL, getHeaders());
    console.log(expenseData);

    let count = 0;
    for (let i = 0; i < expenseData.data.data.length; i++) {
        showExpenseInfo(expenseData.data.data[i], count++);
    }

    showPagination(expenseData.data, count);

}





async function updateRows(e) {

    try {

      const limit = e.target.value;
      localStorage.setItem('rowsPerPage', limit);
  
      let apiURL = `${getAPIURL()}/expense/fetch-expenses?page=1&limit=${limit}`;
      console.log(`URL : ${apiURL}`);
  
      const expenseData = await axios.get(apiURL, getHeaders());
      console.log(expenseData);

        expData.innerHTML = "";
        let count=0;
        for (let i = 0; i < expenseData.data.data.length; i++) {
            showExpenseInfo(expenseData.data.data[i], count++);
        }
       
        showPagination(expenseData.data, count)
    }
    catch (err) {
        alert(err.expenseData.data.message)
    }
  
  }





  function showPagination(pageData, count) {

    const pageContainer = document.getElementById('pagination');
    pageContainer.innerHTML = '';

    if (pageData.hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = 'Previous Page';
        pageContainer.appendChild(btn2);
        btn2.addEventListener('click', () => getExpenses(pageData.previousPage, count));

    }
    
    const btn1 = document.createElement('button');
    btn1.innerHTML = `${pageData.currentPage}`;
    pageContainer.appendChild(btn1);
    btn1.addEventListener('click', () => getExpenses(pageData.currentPage, count));

    if (pageData.hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = 'Next Page';
        pageContainer.appendChild(btn3);
        btn3.addEventListener('click', () => getExpenses(pageData.nextPage, count));
    }
}




async function getExpenses(page, count) {

    try {
        
        const limit = localStorage.getItem('rowsPerPage') || 5;

        let apiURL = `${getAPIURL()}/expense/fetch-expenses?page=${page}&limit=${limit}`;
        console.log(apiURL);

        const expenseData = await axios.get(apiURL, getHeaders());
        console.log(expenseData);
        
        expData.innerHTML = "";
        for (let i = 0; i < expenseData.data.data.length; i++) {
            showExpenseInfo(expenseData.data.data[i], count++);
        }
       
        showPagination(expenseData.data, count)
       
    }
    catch (err) {
        alert(err.expenseData.data.message)
    }
}





async function showExpenseInfo(element,  index) {  
        
    const date = new Date(element.date);    
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    let createElement = `<tr class='expenseDetail'>
        <td data-title="S.No">${index + 1}</td>
        <td data-title="Expense Picture"><img src='${element.imgPath}' alt='' width='50' height='50'></td>
        <td data-title="Expense Type">${element.type}</td>
        <td data-title="Expense Category">${element.category}</td>
        <td data-title="Expense Name">${element.name}</td>
        <td data-title="Expense Desciption">${element.description}</td>
        <td data-title="Expense Amount">${element.amount}</td>
        <td data-title="Expense Date">${formattedDate}</td>
        <td data-title="Action">
            <button class='btn btn-success' onclick="readInfo('${element.imgPath}', '${element.type}', '${element.category}', '${element.name}', '${element.description}', '${element.amount}', '${formattedDate}')" data-bs-toggle='modal' data-bs-target='#readData'><i class='bi bi-eye'></i></button>
            <button class='btn btn-primary' onclick="editInfo('${element.id}', '${element.imgPath}', '${element.type}', '${element.category}', '${element.name}', '${element.description}', '${element.amount}', '${formattedDate}')" data-bs-toggle='modal' data-bs-target='#addExpenseForm'><i class='bi bi-pencil-square'></i></button>
            <button class='btn btn-danger' onclick='deleteInfo(${element.id})'><i class='bi bi-trash'></i></button>
        </td>
    </tr>`
    
    expData.innerHTML += createElement;
}



function readInfo(ePic, eType, eCat, eName, eDesc, eAmt, eDate) {

    document.querySelector('.n_showImg').src = ePic;
    document.querySelector('#i_show_expType').value = eType;
    document.querySelector('#i_show_expCat').value = eCat;
    document.querySelector('#i_show_expName').value = eName;
    document.querySelector('#i_show_expDesc').value = eDesc;
    document.querySelector('#i_show_expAmt').value = eAmt;
    document.querySelector('#i_show_expDate').value = eDate;

}




function editInfo(index, ePic, eType,  eCat, eName, eDesc, eAmt, eDate) {
   
    isEdit = true;
    editId = index;
    imgInput.src = ePic;

    // For Radio Buttons
    if (eType === 'Expense') {
        document.getElementById('expense').checked = true;
    } else if (eType === 'Income') {
        document.getElementById('income').checked = true;
    }

    document.getElementById('i_expenseCategoryDropdown').innerText = eCat;

    expName.value = eName;
    expDesc.value = eDesc;
    expAmt.value = eAmt;
    expDate.value = eDate;

    submitBtn.innerText = 'Update';
    modalTitle.innerText = '#Update The Form!!!';

}




async function deleteInfo(index) {

    try {

        confirm('Are you sure want to delete?')
        console.log(`Deleting user with ID : ${index}`);
        
        let apiURL = `${getAPIURL()}/expense/delete-expense/${index}`;
        console.log('URL : ' +apiURL);

        const response = await axios.delete(apiURL, getHeaders());
        console.log('Response : ' +response);

        if (response.status === 200) {
            alert('User successfully deleted');
            location.reload();
        } else {
            alert('Failed to delete user');
        }

    } catch (err) {
        console.error(`Error deleting user: ${err}`);
    }

}




form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    formData.set('n_Category', getSelectedCandidate());
    formData.set('n_transactionType', getSelectedTransactionType());


    if (imgInput.src === undefined || imgInput.src === '') {
        formData.set('n_imgInput', './image/Profile Icon.webp');
    } else {
        formData.set('n_imgInput', imgInput.src);
    }

    if (!isEdit) {

        try {

            const resp = await axios.post(`${getAPIURL()}/expense/insert-expense`, formData, getHeaders());
            
            if (resp.status === 201) {
                
                alert('Expense added successfully');
                const limit = localStorage.getItem('rowsPerPage') || 5;
                const totalExpenses = document.querySelectorAll('#expenseData tr').length;

                if (totalExpenses == 0 || totalExpenses % limit !== 0) {
                    showExpenseInfo(resp.data, resp.data.id);
                }

                location.reload();
            
            } else {
                alert('Failed to add expense');
            }

        } catch (error) {
            console.error('Error adding expense: ' + error);
        }

    } else {

        try {

            formData.set('n_Category', document.getElementById('i_expenseCategoryDropdown').innerText);
            const response = await axios.put(`${getAPIURL()}/expense/update-expense/${editId}`, formData, getHeaders());

            if (response.status === 200) {
                alert('Expense updated successfully');
                location.reload();
            } else {
                alert('Failed to update expense');
            }

        } catch (error) {
            console.error('Error updating expense:' + error);
        }

    }

    submitBtn.innerText = 'Submit';
    modalTitle.innerHTML = 'Fill The Form';
    document.getElementById("i_expPaperWorkForm").reset();
    imgInput.src = '/images/Profile Icon.webp';
   
})




async function fetchTotalExpense() {

    try {
        
        const response = await axios.get(`${getAPIURL()}/expenseadmin/totalexpense`);
        const totalExpense = response.data.totalExpense;
        document.getElementById('totalPrice').value = totalExpense;
    
    } catch (error) {
        console.error('Error fetching total expense:', error);
    }

}




//Reset form
function resetForm() {
  
    isEdit = false;
    editId = null;
    imgInput.src = '';

    // For Radio Buttons
    document.getElementById('expense').checked = true;
    document.getElementById('income').checked = false;

    // For Dropdown
    document.getElementById('i_expenseCategoryDropdown').innerText = 'Category';
    document.getElementById('i_expName').value = '';
   
    expDesc.value = '';
    expAmt.value = '';
    expDate.value = '';

}



function createPaginationButtons() {

    const totalItems = sampleData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginationButtonsElement = document.getElementById("paginationButtons");
    paginationButtonsElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-secondary", "mx-1");
        button.textContent = i;

        button.addEventListener("click", function () {
            displayData(i);
        });

        paginationButtonsElement.appendChild(button);
    }
}





//!Homework - Make Below Code Modular
//TODO - set headers and token
const getHeaders = () => {
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
  const getAPIURL = () => {
  
    if (environment.toUpperCase() === 'LOCAL') {
      return LOCAL_WINDOWS_APIURL;
    } else if (environment.toUpperCase() === 'PRODUCTION') {
      return LOCAL_AWS_APIURL;
    } else {
      throw new Error('Invalid environment specified');
    }
  
  };
  




  // Call the fetchTotalExpense function when the page loads
document.addEventListener('DOMContentLoaded', async () => {

    initPage();
});