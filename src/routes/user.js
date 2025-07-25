const express = require("express");
const { userAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender about skills"

// Get all pending connection requests for loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data Fetched Successfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// GET ALL CONNECTION REQUEST
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    // Get logged in user from userAuth;
    const loggedInUser = req.user;
    // Find connections of loggedIn user
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "age"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connectionRequest.map((item) => {
      if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return item.toUserId;
      }
      return item.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// FEED API
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // 1.Find Logged user
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // 2.Find all connection req SEND & RECIEVED
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    // 3.Blocked Users - set is used here
    const hideUsersFromFeed = new Set();;

    connectionRequest.forEach((item) => {
      hideUsersFromFeed.add(item.fromUserId).toString();
      hideUsersFromFeed.add(item.toUserId).toString();
    });


    const users = await User.find({
      $and: [
        // not in 
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        // not equal
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)

    res.send(users);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = userRouter;
