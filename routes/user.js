const express = require('express')
const router = express.Router();

const userController = require('../controllers/user')

router.post("/signup", userController.createNewUser);
router.post("/login", userController.authenticateUser);


module.exports = router;