const express = require("express");

const app = express();

const {adminAuth ,userAuth} = require('./Middleware/auth')

// Handle Auth MiddleWare

app.use("/admin",adminAuth)

app.get("/user",userAuth,(req,res) => {
  res.send("User Data Sent")
})

app.get("/admin/getAllDAta",(req,res) => {
  res.send("All Data Sent")
})

app.get("/admin/deleteuser",(req,res) => {
  res.send("Deleted a User")
})


app.listen(3000, () => {
  console.log("Server is running in http://localhost:3000 ");
});
