const sequelize = require('../utils/database');
const Expense = require('../models/Expense')
const User = require('../models/User')




//update expense
exports.updateExpense = async (req, res) => {

  let t;

  try {
      
    const {amount ,description, category, amountType} = req.body;
    const { id } = req.params;
      
    if (!id.trim()) { 
      return res
        .status(400)
        .json({error: 'Expense Id is missing in url for update.'})
    }
      
    t = await sequelize.transaction();

    const [updatedRowsCount, updatedExpense] = await Expense.update({ 
      imgPath: req.body.n_imgInput,
      type: req.body.n_transactionType,
      category: req.body.n_Category,
      name: req.body.n_expName,
      amount: req.body.n_expAmount,
      description: req.body.n_expDescription,
      date: req.body.n_expDate
    }, 
    { 
      where: {id : id},
      returning: true,
      transaction: t 
    });
        
    if (updatedRowsCount === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ 
          status: "Failed",
          message: "Expense Update Failed", 
          data: updatedExpense
        });   
    }
    
    await t.commit();
    console.log(`Expense with ID ${id} updated successfully.`);

    return res
      .status(200)
      .json({ 
        status: "Success",
        message: "Expense Updated SuccessFully", 
        data: updatedExpense
      }); 

  } catch(err) {

      console.error(`Error in updating expense: ${err}`);
      
      return res
        .status(500)
        .json ({ 
          status: "error", 
          message: "Expense data not updated - Internal server error. Please try again later.", 
        });

  }

}


//delete Expense
exports.deleteExpense = async (req, res) => {

  let t;

  try {
      
    const { id } = req.params;

    if(!id.trim()) {
       
          return res
          .status(400)
          .json({error : 'Expense id not present to delete expense.'});
    
    }

    t = await sequelize.transaction();
    console.log(`Deleting Expense with ID: ${id}`);

    const expense = await Expense.findByPk(id,  { transaction: t });

    if (!expense) {
      await t.rollback();
      return res
      .status(400)
      .json({error : 'Expense record not found in db.'})
    
    }

    const rowsDeleted = await Expense.destroy({
      where: {
        id: id,
        userId: req.user.id
      },
      transaction: t
    });

    if (rowsDeleted > 0) {

      await t.commit();
      return res
        .status(200)
        .json({ status: "success",
         message: "Expense data deleted sucessfully", 
         data: rowsDeleted });    

    } else {

      await t.rollback();
      return res
        .status(404)
        .json({ status: "error", 
        message: "Expense data Not deleted - Some Error", 
        data: rowsDeleted });    

    }
  
    } catch(err) {

      if (t) 
      await t.rollback();

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
    
    const user = req.user;
    const page = req.query.page;
	
    console.log('Page: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', page);

	  const itemsPerPage = 5
    const limit = Number(req.query.limit) || itemsPerPage;
    const offset = (page-1)* limit;
	
	  Promise.all([
      user.countExpenses(), 
		  Expense.findAll({ where: {userId : req.user.id}, offset: offset, limit: limit})
    ]).then(([count, expenses]) => {
		  console.log(count);
      const hasMoreData = count - (page-1)*limit > limit ? true : false;
      const nextPage = hasMoreData ? Number(page) + 1 : undefined;
      const previousPage = page > 1 ? Number(page)-1 : undefined;
      const hasPreviousPage = previousPage ? true : false

		res.status(200).json({
      data: expenses,
      message: "Expenses Found",
      hasNextPage: hasMoreData,
      nextPage: nextPage,
      currentPage: page,
      previousPage: previousPage,
      hasPreviousPage: hasPreviousPage
      })
    })

    console.log('-----No Expense Found-----');

    // return res
    //   .status(200)
    //   .json({ 
    //     status: "success", 
    //     message: "No Expense Found in db.", data: [] 
    //   });
     
    } catch(error) {

      console.log(`Error in fetching all expenses : ${error}`)
      
      res
      .status(500)
      .json({status: "Failed", message: "Failed to fetch all expenses"});
    }
     
}




//Post Request - AddExpense
exports.postExpenseData = async (req, res) => {

  //console.log('-------------Image-Path -------------' +req.body.n_imgInput);
  console.log('--------------RadioFilter -------------' +req.body.n_transactionType);
  console.log('-------------Category -------------' +req.body.n_Category);
  console.log('-------------Expense-Name-------------' +req.body.n_expName);
  console.log('-------------Amount -------------' +req.body.n_expAmount);
  console.log('-------------Description -------------' +req.body.n_expDescription);
  console.log('-------------date -------------' +req.body.n_expDate);  
  console.log('-----------------Request-Body--------------------' +req.body);
  console.log('-----------------Request-Param--------------------' +req.user.id);

  let t;

  try { 

      t = await sequelize.transaction();
        
      const newExpense = await Expense.create({
        imgPath : req.body.n_imgInput,
        type : req.body.n_transactionType,
        category : req.body.n_Category,
        name : req.body.n_expName,
        amount : req.body.n_expAmount,
        description : req.body.n_expDescription,
        date : req.body.n_expDate,
        userId : req.user.id
      }, { transaction: t });

      console.log(`New-Expense : ${newExpense.amount}`);

      const user = await User.findByPk(req.user.id, { transaction: t });
      console.log(`Total-Amount : ${user.totalamount}`);

      if (!user) {
        throw new Error('User not found');
      }
      
      let totalAmount = user.totalamount + newExpense.amount;
      await user.update({ totalamount: totalAmount }, { transaction: t });
      await t.commit();
  
      console.log('------Expense Inserted Successfully-------');
      
      return res
        .status(201)
        .json({
          status: "success",
          message: "Expense inserted successfully.",
          data: newExpense,
        });
        
    } catch(error) {
      await t.rollback();
      console.error("Error in adding expense : " +error.message);
        
      return res
        .status(500)
        .json({ 
          status: "Failed-Error", 
          message: "Failed to create post." 
        });
    }

}