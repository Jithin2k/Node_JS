const express = require("express");
const connectDB = require("./Config/Database");
const app = express();
const cookieParser = require("cookie-parser");






// Middleware
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);






connectDB()
  .then(() => {
    console.log("DB Connection Established");
    app.listen(3000, () => {
      console.log("Server is running in http://localhost:3000 ");
    });
  })
  .catch((err) => {
    console.log("DB connecction Failed");
  });
