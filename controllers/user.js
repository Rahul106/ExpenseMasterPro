
const UserModel = require('../models/User');
const { isNotValidInput } = require('../utils/validation');
const { comparePasswords } = require('../utils/password');


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

    const user = await UserModel.findOne({ where: { email } });
    
    if(user) {
       return comparePasswords(password, user.password) ?  res.status(200).json({message: 'User logged in successfully', success: true}) : res.status(401).json({ message: 'User not authorized. Password Incorrect.' , success: false }); 
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

        //const hashedPswd = await bcrypt.hash(password, 10);
        await UserModel.create({
          name,
          email,
          password
          //password: hashedPswd,
        });
        
        return res.status(201).json({ userAddedResponse: "Successfuly created new user.!" });

    } catch(error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({message:"User(Email-id) already exists. Please Login or change the Email id."});
          }
          return res.status(500).json({ message: error });
    }
    
};

