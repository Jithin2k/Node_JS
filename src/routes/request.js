const express = require("express");

const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../Middleware/auth");

// SEND CONNECTION REQUEST
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user + "send connection request");
});


module.exports = requestRouter;