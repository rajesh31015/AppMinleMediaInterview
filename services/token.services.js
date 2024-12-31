require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretId = process.env.SECRET_KEY;
const generateToken = async (data, expiresIn = "24h") => {
  const token = await jwt.sign(data, secretId, { expiresIn: expiresIn });
  return token;
};

module.exports = {
  generateToken,
};
