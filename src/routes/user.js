const express = require("express");
const { userAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// Get all pending connection requests for loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId",["firstName","lastName"])

    res.json({
        message : "Data Fetched Successfully",
        data : connectionRequest
    })

  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = userRouter;
