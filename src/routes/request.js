const express = require("express");

const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

// SEND CONNECTION REQUEST
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "invalid Status Type" });
      }

      const toUser = await User.findById(toUserId);

      if (toUser === null) {
        return res
          .status(404)
          .json({ message: "User does not exist in the database" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection Already Exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR......" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      // Status validation check
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is invalid" });
      }

      // Request ID check in the DB
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request not found" });
      }
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection Request was" + status,data });
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);

module.exports = requestRouter;
