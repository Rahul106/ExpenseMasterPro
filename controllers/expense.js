const sequelize = require('../utils/database');

const Expense = require('../models/Expense')



//update expense
exports.updateExpense = async (req, res) => {

  console.log('----------------------------------');
  try {
      
      const {amount ,description, category, amountType} = req.body;
      const { id } = req.params;
      
      if (!id.trim()) { 
        return res
        .status(400)
        .json({error: 'Expense Id is missing in url for update.'})
      }
      
      const updatedExpense = await Expense.update({ 
        imgPath: req.body.n_imgInput,
        type: req.body.n_transactionType,
        category: req.body.n_Category,
        name: req.body.n_expName,
        amount: req.body.n_expAmount,
        description: req.body.n_expDescription,
        date: req.body.n_expDate
      }, 
      { 
          where: {id : id} 
      });
        
      if (updatedExpense[0] === 0) {
        return res
          .status(400)
          .json({ status: "Failed",
              message: "Expense Update Failed", 
              data: updatedExpense });   
      }
    
      return res
          .status(200)
          .json({ status: "Success",
              message: "Expense Updated SuccessFully", 
              data: updatedExpense }); 

  } catch(err) {

      console.error(`Error in updating expense: ${err}`);
      
      return res
        .status(500)
        .json ({ 
          status: "error", 
          message: "Expense data not updated - Internal server error. Please try again later.", 
          data: updatedExpense 
        });

}

}


//delete Expense
exports.deleteExpense = async (req, res) => {

  try {
      
    const { id } = req.params;
      
    if(!id.trim()) {
       
          return res
          .status(400)
          .json({error : 'Expense id not present to delete expense.'});
    
    }

    const expense = await Expense.findByPk(id);

    if (!expense) {
      
      return res
      .status(400)
      .json({error : 'Expense record not found in db.'})
    
    }

    const rowsDeleted = await Expense.destroy({
      where: {
        id: id,
        userId: req.user.id
      },
    });

    if (rowsDeleted > 0) {

      return res
        .status(200)
        .json({ status: "success",
         message: "Expense data deleted sucessfully", 
         data: rowsDeleted });    

    } else {

      return res
        .status(404)
        .json({ status: "error", 
        message: "Expense data Not deleted - Some Error", 
        data: rowsDeleted });    

    }
  
    } catch(err) {

      console.error(`Error in deleting expense : ${err}`);
      
      return res
        .status(500)
        .json({ status: "error", 
        message: "Expense data Not deleted - Internal server error. Please try again later.", 
        data: rowsDeleted }); 
  } 

}



//Get Request - Fetch Expense
exports.getAllExpenses = async (req, res) => {

  try {
    
    const allExpenses = await Expense.findAll({ where: {userId : req.user.id}});
    console.log(`All-Expenses : ${allExpenses}`);

    if (!allExpenses || allExpenses.length === 0) {
        
      console.log('-----No Expense Found-----');

      return res
        .status(200)
        .json({ status: "success", 
        message: "No Expense Found in db.", data: [] });

    }

      return res
        .status(200)
        .json({ status: "success", data: allExpenses });

    } catch(error) {

      console.log(`Error in fetching all expenses : ${error}`)
      
      res
      .status(500)
      .json({status: "Failed", message: "Failed to fetch all expenses"});
    }
     
}



//Post Request - AddExpense
exports.postExpenseData = async (req, res) => {

  console.log('-------------Image-Path -------------' +req.body.n_imgInput);
  console.log('--------------RadioFilter -------------' +req.body.n_transactionType);
  console.log('-------------Category -------------' +req.body.n_Category);
  console.log('-------------Expense-Name-------------' +req.body.n_expName);
  console.log('-------------Amount -------------' +req.body.n_expAmount);
  console.log('-------------Description -------------' +req.body.n_expDescription);
  console.log('-------------date -------------' +req.body.n_expDate);  
  console.log('-----------------Request-Body--------------------' +req.body);
  console.log('-----------------Request-Param--------------------' +req.user.id);

 // const t = await sequelize.transaction();

  try {
     
        const newExpense = await Expense.create({
            imgPath : req.body.n_imgInput,
            type : req.body.n_transactionType,
            category : req.body.n_Category,
            name : req.body.n_expName,
            amount : req.body.n_expAmount,
            description : req.body.n_expDescription,
            date : req.body.n_expDate,
            userId : req.user.id
        });

        if (newExpense) {
            
            console.log('------Expense Inserted Sucessfully-------')
            
            return res.status(201).json({
              status: "success",
              message: "Expense inserted successfully.",
              data: newExpense,
            });
          
          } else {
            
            console.log('------Expense Insertion Fails-------')
            return res
              .status(500)
              .json({ status: "Failed", 
              message: "Expense insertion fails. Failed to add expense."
             });
          
          }

    } catch(error) {
        //await t.rollback();
        console.error("Error in adding expense : " +error.message);
        
        return res
            .status(500)
            .json({ status: "Failed-Error", message: "Failed to create post." });
    }

}