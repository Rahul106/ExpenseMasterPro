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

$(".dropdown-menu li a").click(function(){
    var selText = $(this).text();
    $(this).parents('.dropdown').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
  });


console.log('Form' + form);
console.log('ImageInput' + imgInput);
console.log('File : ' + imgFile);
console.log('UserName : ' + expNum + expName + expAmt + expDate);
console.log('Submit : ' + submitBtn);
console.log('ExpenseData : ' + expData);
console.log('Modal : ' + modal);
console.log('ModalTitle : ' + modalTitle);
console.log('UserButton : ' + newExpenseBtn);




let isEdit = false;
let editId = 0;



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
    alert(selectedCategory);
    if (!selectedCategory || selectedCategory.toLowerCase() === "category") {
        alert('Default Category Used');
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



async function showExpenseInfo() {  

    // Clear existing posts
    expData.innerHTML = "";

    const responseExpenses = await axios.get('http://localhost:4000/expense/fetch-expenses');

    responseExpenses.data.data.forEach((element, index) => {

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
    });

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

    // For Dropdown
    let dropdownItems = document.querySelectorAll('#i_expenseCategoryDropdown .dropdown-item');
    dropdownItems.forEach(item => {
        if (item.innerText.trim() === eCat) {
            document.getElementById('i_expenseCategoryDropdown').innerText = eCat;
        }
    });

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
        const response = await axios.delete(`http://localhost:4000/expense/delete-expense/${index}`);
         
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

            const resp = await axios.post('http://localhost:4000/expense/insert-expense', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (resp.status === 201) {
                alert('Expense added successfully');
                location.reload();

            } else {
                alert('Failed to add expense');
            }

        } catch (error) {
            console.error('Error adding expense: ' + error);
        }

    } else {

        try {

            const response = await axios.put(`http://localhost:4000/expense/update-expense/${editId}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


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
        
        const response = await axios.get('http://localhost:3000/expenseadmin/totalexpense');
        const totalExpense = response.data.totalExpense;
        document.getElementById('totalPrice').value = totalExpense;
    
    } catch (error) {
        console.error('Error fetching total expense:', error);
    }

}


// Call the fetchTotalExpense function when the page loads
document.addEventListener('DOMContentLoaded', showExpenseInfo);

///showExpenseInfo();




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
