const expenseController = require('../controllers/expense')

const express = require('express');
const router = express.Router();



router.post('/insert-expense', expenseController.postExpenseData);

router.get('/fetch-expenses', expenseController.getAllExpenses);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

router.put('/update-expense/:id', expenseController.updateExpense);



module.exports = router;