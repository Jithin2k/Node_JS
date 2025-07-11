// Express Router
const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../Utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGN UP
authRouter.post("/signup", async (req, res) => {
  try {
    // 1.Validation Of Data
    validateSignUpData(req);
    // 2.Encrypt The Password
    const { password, firstName, lastName, email } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // User
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    if (user.skills.length > 10) {
      throw new Error("SKills cannot exceed 10");
    }
    await user.save();

    //  const token = await jwt.sign({ _id: user._id }, "DEV@$790", { expiresIn: "1h" });

    res.send("User Added to DB");
  } catch (error) {
    res.status(400).send("ERROR IS : " + error.message);
  }
});

// LOGIN API
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email is not in Database");
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successful");
    } else {
      throw new Error("Password is not correct");
    }
  } catch (error) {
    res.status(400).send("ERROR IS : " + error.message);
  }
});

// LOGOUT
authRouter.post("/logout",async(req,res) => {
res.cookie("token",null,{
  expires : new Date(Date.now())
})
res.send("User Logged Out")
})



module.exports = authRouter;
