const express = require("express");
const profileRouter = express.Router();

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

module.exports = profileRouter;
