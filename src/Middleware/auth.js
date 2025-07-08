const jwt = require("jsonwebtoken");
const User = require("../models/user");


// Auth Middleware - Read Token , Validate and Find user.
const userAuth = async(req, res, next) => {

  try {
    // 1.Reading token from the request
  const {token} = req.cookies;

  if(!token){
    throw new Error("Token is not Valid");
  }

  const decodedObj = await jwt.verify(token,"DEV@$790");

  const {_id} = decodedObj;

  const user =await User.findById(_id);
  if(!user){
    throw new Error("User not found")
  } 
  req.user = user;
  next();
  } catch (error) {
    res.status(400).send(error.message)
  }

  // Find the User

};
module.exports = { userAuth };
