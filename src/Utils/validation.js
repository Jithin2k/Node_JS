const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfileData = (body) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "about",
    "skills",
    "gender",
  ];

  const isEditAllowed = Object.keys(body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;  
};
module.exports = { validateSignUpData ,validateEditProfileData};
