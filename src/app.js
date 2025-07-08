const express = require("express");
const connectDB = require("./Config/Database");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("./Utils/validation");
const { userAuth } = require("./Middleware/auth");

const User = require("./models/user");

// Middleware
app.use(express.json());
app.use(cookieParser());

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

// PROFILE API
app.get("/profile", userAuth, async (req, res) => {
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

// LOGIN API
app.post("/login", async (req, res) => {
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

// SEND CONNECTION REQUEST
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user + "send connection request");
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
