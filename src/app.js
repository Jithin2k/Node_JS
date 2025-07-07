const express = require("express");
const connectDB = require("./Config/Database");
const app = express();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./Utils/validation");

const User = require("./models/user");

app.use(express.json());

// SIGN UP API
app.post("/signup", async (req, res) => {
  try {
    // 1.Validation Of Data
    validateSignUpData(req);

    // 2.Encrypt The Password

    const { password, firstName, lastName, email } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    console.log(passwordHash);

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

    res.send("User Added to DB");
  } catch (error) {
    res.status(400).send("ERROR IS : " + error.message);
  }
});

// LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email is not in Database");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successful");
    } else {
      throw new Error("Password is not correct");
    }
  } catch (error) {
    res.status(400).send("ERROR IS : " + error.message);
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
    res.status(404).send(error.message);
  }
});

// GET request to show all users

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(404).send("Failed request");
  }
});

// DELETE a user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Update DAta of user

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "age",
      "skills",
      "photoUrl",
      "about",
      "gender",
      "userId",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills limit cannot exceed 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

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
