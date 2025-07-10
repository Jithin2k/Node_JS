const express = require("express");
const profileRouter = express.Router();

const User = require("../models/user");
const { userAuth } = require("../Middleware/auth");

// PROFILE API
profileRouter.get("/profile", userAuth, async (req, res) => {
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

module.exports  = profileRouter;