const express = require("express");
const {
  signup,
  login,
  sendOtp,
  verifyOtp,
  completeProfileStep1,
  completeProfileStep2,
  completeProfileStep3,
  completeProfileStep4,
} = require("../../controller/user/auth.controller");
const { userValidation } = require("../../validation/user.validation");
const { celebrate } = require("celebrate");
const { verifyUserToken } = require("../../middlware/authentication.middlware");
const router = express.Router();

router
  .route("/signup")
  .post(celebrate({ body: userValidation.SIGNUP }), signup);
router.route("/login").post(celebrate({ body: userValidation.LOGIN }), login);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyUserToken, verifyOtp);
router.post("/completeProfileStep1", verifyUserToken, completeProfileStep1);
router.post("/completeProfileStep2", verifyUserToken, completeProfileStep2);
router.post("/completeProfileStep3", verifyUserToken, completeProfileStep3);
router.post("/completeProfileStep4", verifyUserToken, completeProfileStep4);

module.exports = router;
