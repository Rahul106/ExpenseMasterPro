const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const cors = require('cors')
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const compression = require("compression");
const morgan = require("morgan");




//middleware for user authentication
const userAuthentication = require('./middlewares/auth');




const publicPath = path.join(__dirname, "public");



//models
const User = require("./models/User");
const Expense = require('./models/Expense');
const Order = require('./models/Order');
const Password = require("./models/Password");
const DownloadedFile = require('./models/DownloadedFile');




//write stream for access log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags: 'a'}
);





//importing routes
const userRoute = require("./routes/user");
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumUserRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');



//middlewares
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));




app.get('/', (req, res) => {
  res.sendFile('portal.html', {root: 'views'});
});  

app.get('/logout', (req, res) => {
  res.sendFile('portal.html', {root: 'views'});
});

app.get('/reset-password', (req, res) => {
  res.sendFile('forgotpassword.html', {root:'views'});
});


app.get('/home', (req, res) => {
  res.sendFile('home.html', {root:'views'});
});

app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', {root:'views'});
});

app.get('/premium', (req, res) => {
  res.sendFile('premium.html', {root:'views'});
});

app.get('/premium', (req, res) => {
  res.sendFile('premium.html', {root:'views'});
});

app.get('/report', (req, res) => {
  res.sendFile('report.html', {root:'views'});
});



//router middlewares
app.use('/user', userRoute);
app.use('/password', passwordRoutes);
app.use(userAuthentication.isAuthenticated);

app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumUserRoutes);



//DB Relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Password);
Password.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);





const PORT = process.env.PORT || 4000;
sequelize
  //.sync({ force: true })
  .sync()
  .then(() => {
    console.log("models synced with database");
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.error("error syncing models with database:", err);
  });
