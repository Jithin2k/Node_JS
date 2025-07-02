const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    firstName: "Jithin",
    lastName: "Madhav",
  });
});

app.post("/user", (req, res) => {
  console.log("Data Added to Database");
  res.send("Data Successfully Added");
});

app.delete("/user", (req, res) => {
  res.send("Data Deleted");
});

// use will match all http routes
app.use("/a", (req, res) => {
  res.send("Hello Welcome To A");
});

app.listen(3000, () => {
  console.log("Server is running in http://localhost:3000 ");
});
