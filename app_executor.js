const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");


const publicPath = path.join(__dirname, "public");


//models
const User = require("./models/User");


//importing routes
const userRoute = require("./routes/user");
const expenseRoutes = require('./routes/expense');


//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));


//registering routes to app
app.use(userRoute);
app.use('/expense', expenseRoutes);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'portal.html'));
});  

app.get('/home', (req, res) => {
  res.sendFile('home.html', {root:'views'});
});

app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', {root:'views'});
});



//DB Relations
// User.hasMany(Expense);
// Expense.belongsTo(User);



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
