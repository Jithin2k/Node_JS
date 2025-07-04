const express = require("express");
const connectDB = require("./Config/Database");
const app = express();

const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added to DB");
  } catch (error) {
    res.status(400).send("Failed to save User data");
  }
});

// GET user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.findOne({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(404).send("Failed request");
  }
});

// GET request to shoe all users

app.get("/feed",async (req,res)=>{
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
     res.status(404).send("Failed request");
  }
})

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
