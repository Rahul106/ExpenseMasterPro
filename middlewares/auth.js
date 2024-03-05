const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


const isAuthenticated = (req, res, next)=> {
    
    try {
        
        const token = req.header('Authorization');
        console.log(`Token:  ${token}`);
        
        if(!token) { 
            return res
            .status(401)
            .json({ message: 'Unauthorized. No token provided.' }); 
        }

        console.log('-----------------Authenticate-----------------------');

        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(`User : ${user}`);

        User
        .findByPk(user.id)
        .then((user)=> {
            
            if(user){
                req.user = user;
                next();
            }
        
        }) .catch((err)=> {
            throw new Error(err);
        })

    } catch(err){
        res.status(401).json({error: err})
    }
   
}

module.exports = {isAuthenticated};

