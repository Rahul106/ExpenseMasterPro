const User = require('../models/User');
const Forgot = require('../models/Password')
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');
const uuid = require('uuid');




//FORGET PASSWORD FORM CONTROLLER ---SEND MAIL
exports.forgotPassword =  async (req, res) => {

    const { email } = req.body;
    
    try {
    
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            
            return res.status(404).json({ message: 'User not Exists..Please Signup or enter correct email id.' });
        
        } else {

            const randomUUID = uuid.v4()
            const addForget = await Forgot.create({id:randomUUID, active:true, userId : user.dataValues.id})
            
            if(addForget) {
        
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            })

            const resetLink = `${process.env.WEBSITE}/password/reset-password/${randomUUID}`

            const msg = {
                from: process.env.EMAIL,
                to: email,
                subject:'Reset your Expensify-App Password',
                html: `
                    <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                    <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                    <p><a href=${resetLink}>Click here to Reset password</a></p>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    `
              }

            await transporter.sendMail(msg, function(err, info) {
            if(err) {
                return console.log("Error occured in sending mail..",err);
            } else {
                console.log("Email sent successfully")
            }

            }) 
            
            return res.status(202).json({message: 'Reset intiated email sent...Please Reset Passowrd using link in mail. ', success: true})
            
            } else {
               throw new Error('Error in updating forget table')
           } 

        }
    
    } catch(err) {
        return res.json({ message: "Reset link not send", success: false });
    }

}




//RESET LINK FORM METHOD VERIFY AND FIRE EVENT UPDATE
exports.resetPassword = async (req, res) => {
    
    const id =  req.params.id;
    const validUser = await Forgot.findOne({ where : { id , active : true}})
        
    if(validUser) {

        validUser.update({ active: false});
        res.status(200).send(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;700&family=Kavoon&family=Metal+Mania&family=Poppins:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
            
            <link rel="stylesheet" href="/css/portal.css">
            <link rel="stylesheet" href="/css/forgotpassword.css">
            <title>Expensify - Rahul Rajkumar Gupta</title>
        </head>
        
        <body>
        <script>
            function formsubmitted(e){
                e.preventDefault();
            }
        </script>
        
            <header>
                <nav class="navbar">
                    <span class="hamburger-btn material-symbols-rounded">menu</span>
                    <a href="#" class="logo">
                        <img src="/images/Logo5.png" alt="logo">
                        <h2>Expensify</h2>
                    </a>
                    <ul class="links">
                        <span class="close-btn material-symbols-rounded">close</span>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Portfolio</a></li>
                        <li><a href="#">Courses</a></li>
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Contact us</a></li>
                    </ul>
                </nav>
            </header>
        
            <!-- error alert -->
            <div id="errorAlert" class="bg-red-700 rounded-lg p-2 hidden text-base  text-center" role="alert">
            </div>
        
            <!-- success alert-->
            <div id="successAlert" class="bg-green-700 rounded-lg p-2 hidden text-base  text-center" role="alert">
            </div>
            
            <div class="container" id="container">
               

                <div class="form-container sign-in">
                    <form action="/password/updatepassword/${id}" method="GET">
                        <h1>Sign In</h1>
                        <div class="social-icons">
                            <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
                            <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                            <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
                            <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                        </div>
                     
        
                        <div class="input-container">
                            <i class="toggle-password fas fa-lock" onclick="togglePasswordVisibility()"></i>
                            <input type="password" id="i_password" name="newpassword" placeholder="Enter New Password">
                        </div>
                        
                        <button type="submit">Submit</button>

                    </form>
                </div>
        
                <div class="toggle-container">
                    <div class="toggle">
                        <div class="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all Expensify features</p>
                            <h1>फिर से स्वागत है!!</h1>
                            <p>अपना व्यक्तिगत विवरण दर्ज करें ताकि आप सभी Expensify सुविधाओं का उपयोग कर सकें।</p>
                            <button class="hidden" id="login">Sign In</button>
                        </div>
                        <div class="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use Expensify features</p>
                            <h1>नमस्ते, दोस्त!</h1>
                            <p>अपना व्यक्तिगत विवरण दर्ज करें ताकि आप Expensify की सुविधाओं का उपयोग कर सकें।</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        
            <!-- Footer section -->
            <footer class="footer">
                <div class="footer-content">
                    <!-- English Content -->
                    <div class="footer-english">
                        <marquee behavior="scroll" direction="left">  
                        <span class="copyright-logo">&#169;</span>
                        <span> Copyright - All Rights Reserved February 28, 2024 Rahul Rajkumar Gupta !!</span>
                        <span class="copyright-logo">&#169;</span>
                        </span> सर्वाधिकार - सभी अधिकार सुरक्षित २८ फरवरी, २०२४ राहुल राजकुमार गुप्ता</span>
                        </marquee>
                    </div>
                </div>
            </footer>
        
            
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        
        
        </body>
        
        </html>`
                                )
            res.end()
            
        } else{
            console.log("user token invalid. Retry with new reset link.")
            return res.status(404).json({message: "Invalid Link. retry with new password reset link."})
        }
            
}






//UPDATE Password
exports.updatePassword = async (req, res) => {
    
    try {
        
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        
        Forgot.findOne({ where : { id: resetpasswordid }}).then(validUser => {
            console.log('---------------------', validUser.dataValues.id);
            User.findOne({where: { id : validUser.userId}}).then(user => {

                if(user) {
                
                        const saltRounds = 10;
                        bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err) {
                            throw new Error(err);
                        }
                        
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                        
                            if(err) {
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly updated the new password. Please login using new Password.'})
                                return ;
                            })
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }
            })
        })

    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


