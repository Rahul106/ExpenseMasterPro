const express = require('express')
const router = express.Router();

const userController = require('../controllers/user')

router.post("/user/signup", userController.createNewUser);
router.post("/user/login", userController.authenticateUser);


module.exports = router;