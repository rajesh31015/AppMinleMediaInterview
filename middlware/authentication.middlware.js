require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/users/users.model");
const secretId = process.env.SECRET_KEY;

const verifyUserToken = async (req, res, next) => {
  try {
    let { accesstoken, language = "en" } = req.headers;

    if (!accesstoken) {
      return res.status(401).json({
        auth: false,
        message: "No token provided.",
      });
    }
    const decodedData = jwt.verify(accesstoken, secretId);
    const user = await UserModel.findOne({ accessToken: accesstoken }).lean();
    if (!user) {
      return res.status(401).json({
        message: "Your session has expired. Please log in again to continue.",
      });
    }
    req.userData = { ...user, language };
    req.language = language;
    next();
  } catch (error) {
    return res.status(401).json({
      auth: false,
      message: "Your session has expired. Please log in again to continue.",
    });
  }
};

module.exports = {
  verifyUserToken,
};
