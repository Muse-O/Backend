require("dotenv").config();

const bcrypt = require("bcrypt");

const createHashPassword = async (password) => {
  return bcrypt.hash(password, Number(process.env.SALT_ITERATIONS_CNT));
};

const comparePassword = (enteredPassword, hashedPassword) => {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = { createHashPassword, comparePassword };