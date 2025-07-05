const mongoose = require("mongoose");
// Email Validation Library
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength : 50,
    lowercase: true
  },
  lastName: {
    type: String,
    minLength: 4,
    maxLength : 50,
    lowercase: true
  },
  age: {
    type: Number,
    min: 18,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
   validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Email is not valid")
      }
    }
  },
  gender: {
    type: String,
    lowercase: true,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength : 8,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Strong Password Required")
      }
    }
  },
  about: {
    type: String,
    default: "Available",
    trim: true,
  },
  photoUrl: {
    type: String,

  },
  skills: {
    type: [String],
  },
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;
