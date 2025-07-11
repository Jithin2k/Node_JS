const express = require("express");
const profileRouter = express.Router();
const validator = require("validator")
const User = require("../models/user");
const { userAuth } = require("../Middleware/auth");
const { validateEditProfileData } = require("../Utils/validation");

// PROFILE API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR IS : " + error.message);
  }
});

// PROFILE EDIT

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    res.send(`${loggedInUser.firstName} Profile Updated`);
    await loggedInUser.save();
  } catch (error) {
    res.status(400).send("ERROR IS : " + error.message);
  }
});


// PASSWORD EDIT

profileRouter.patch("/profile/passwordchange",async(req,res) =>{
  try {
    const {email,password,newPassword} = req.body;

    const user = await User.findOne({email : email})

    if(!user){
      throw new Error("Email not found")
    }

    const isMatch = await user.verifyPassword(password);

  if(!isMatch){
    throw new Error("Wrong Password")
  }

  if(password === newPassword){
    throw new Error("Cannot Reuse PAssword")
  }

  if(!validator.isStrongPassword(newPassword)) {
    throw new Error("Strong Password Required")
  }
const hashedPassword = await user.hashPassword(newPassword)
  user.password = hashedPassword;
 await user.save();
 res.status(200).send("Password Updated Successfully")
    
  } catch (error) {
     res.status(400).send("ERROR IS : " + error.message);
  }
})

module.exports = profileRouter;
