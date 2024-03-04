
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { isNotValidInput } = require('../utils/validation');



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
       
        console.log('-------------------' +generateAccessToken(user.id, user.name));

       return hashresponse === true ?  res.status(200).json({message: 'User logged in successfully', success: true, token : generateAccessToken(user.id, user.name)}) 
       : res.status(401).json({ message: 'User not authorized. Password Incorrect.' , success: false });
      
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