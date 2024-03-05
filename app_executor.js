const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");



//middleware for user authentication
const userAuthentication = require('./middlewares/auth');


const publicPath = path.join(__dirname, "public");


//models
const User = require("./models/User");
const Expense = require('./models/Expense');
const Order = require('./models/Order');



//importing routes
const userRoute = require("./routes/user");
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');


//middlewares
require('dotenv').config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));




app.get('/', (req, res) => {
  res.sendFile('portal.html', {root: 'views'});
});  

app.get('/logout', (req, res) => {
  res.sendFile('portal.html', {root: 'views'});
});

app.get('/home', (req, res) => {
  res.sendFile('home.html', {root:'views'});
});

app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', {root:'views'});
});




//router middlewares
app.use('/user', userRoute);

app.use(userAuthentication.isAuthenticated);

app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);



//DB Relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);




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
