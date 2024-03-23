const express = require('express')
const router = express.Router();

const passwordController = require('../controllers/passsword');


router.post("/forgotpassword", passwordController.forgotPassword);

router.get("/reset-password/:id", passwordController.resetPassword)

router.get('/updatepassword/:resetpasswordid',passwordController.updatePassword)

module.exports = router;