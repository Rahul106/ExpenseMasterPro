const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");


const publicPath = path.join(__dirname, "public");


//models
const User = require("./models/User");


//importing routes
const commonRoutes = require("./routes/user");


//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));


app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});  


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