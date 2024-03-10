
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { isNotValidInput } = require('../utils/validation');
const { Sequelize } = require('sequelize');
const Expense = require('../models/Expense');



//CurrentUserInformation
exports.getCurrentUserInfo = async(req, res, next) => {

  console.log('-----Request-User-Info------');

  try {
     
    console.log('User-Id : ' +req.user.id);

    const userDetails = await User.findOne({
      attributes: ['name', 'email', 'ispremiumuser'],
      where: {
        id: req.user.id
      }
    });

    const totalExpense = await Expense.sum('amount', {
      where: {
        userId: req.user.id,
        type: 'expense'
      }
    });

    
    const totalIncome = await Expense.sum('amount', {
      where: {
        userId: req.user.id,
        type: 'income' 
      }
    });
    
    if (userDetails && (totalExpense || totalIncome)) {
        
      console.log('------User Found Successfull-------')
      
      return res.status(200).json({
        status: "success",
        message: "User found successfull.",
        data: {
          name: userDetails.name,
          email: userDetails.email,
          ispremiumuser: userDetails.ispremiumuser,
          totalexpense: totalExpense || 0,
          totalincome: totalIncome || 0
        },
      });
    
    } else {
      
      console.log('------User Not Found -------')
      return res
        .status(404)
        .json({ status: "Failed", 
        message: "User not found"
       });
    
    }

  } catch(error) {
  
    console.error("Error in fetching current user: " +error.message);
    
    return res
        .status(500)
        .json({ status: "Failed-Error", message: "Error-Failed to Found User." });
  } 

}






//Login Controller
exports.authenticateUser = async(req, res, next) => {

  try {

    const { email, password } = req.body;

    if(isNotValidInput(email)) {
        return res.status(400).json({ message: 'email is not present. kindly fill the email' , success: false });
    }
    
    if(isNotValidInput(password)) {
      return res.status(400).json({ message: 'password is not present. kindly fill the password', success: false});
    }

    const user = await User.findOne({ where: { email } });
    
    if(user) {
      
      bcrypt.compare(password, user.password, (hasherr, hashresponse) => {

        if(hasherr){
          throw new Error("Something went wrong in authentication");
        }
       
        if(hashresponse) {

          const token = generateAccessToken(user.id, user.name);

          // req.session.timer = setTimeout(() => {
          //   console.log('User automatically logged out after inactivity.');
          // }, 1 * 60 * 1000);

          return res.status(200).json({message: 'User logged in successfully', success: true, token : token, data: user})
          
        } else {
          res.status(401).json({ message: 'User not authorized. Password Incorrect.' , success: false });
        }

      });

    } else {
        return res.status(404).json({ message: 'User not found/exists' });
    }
    
  } catch (error) {
    
    return res.status(500).json({ message:error });
  
  }
  
};




//SignUp Page Controller
exports.createNewUser = async(req, res, next) => {
    
    try {

        const { name, email, password } = req.body;

        if(isNotValidInput(name)) {
            return res.status(400).json({ message: 'name is not present. kindly fill the name' });
        } else if (isNotValidInput(email)) {
            return res.status(400).json({ message: 'email is not present. kindly fill the email' });
        } else if (isNotValidInput(password)) {
            return res.status(400).json({ message: 'password is not present. kindly fill the password' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({
          name,
          email,
          password: hashedPassword
        });
        
        return res.status(201).json({ userAddedResponse: "Successfuly created new user.!" });

    } catch(error) {
        
      if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({message:"User(Email-id) already exists. Please Login or change the Email id."});
          }

          return res.status(500).json({ message: error });
    }
    
};



//function generateAccessToken ...has(payload,secretkey) encrypt payload using secret key
const generateAccessToken = (id, name) => {

  return jwt.sign({id:id, name:name}, process.env.JWT_SECRET_KEY);

}