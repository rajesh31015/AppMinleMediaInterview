const { UserModel } = require("../../models/users/users.model");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../response/response");
const { enMessage } = require("../../response/enMessage");
const { decrypt, encrypt } = require("../../services/bcrypt.services");
const { generateToken } = require("../../services/token.services");

const signup = async (req, res) => {
  try {
    const {
      countryCode,
      mobileNumber,
      email,
      password,
      whyUseService,
      whatDescribesBest,
      isWhatDescribesBest,
      companyName,
      businessDirection,
      noOfPeopleInTeam,
      membersEmail,
    } = req.body;

    const data = {
      countryCode,
      mobileNumber,
      email,
      password: await encrypt(password),
      whyUseService,
      whatDescribesBest,
      isWhatDescribesBest,
      companyName,
      businessDirection,
      noOfPeopleInTeam,
      membersEmail,
    };

    const checkMobileExists = await UserModel.findOne({
      countryCode,
      mobileNumber,
    });
    if (checkMobileExists) {
      return sendErrorResponse({
        res,
        message: enMessage.MOBILE_NUMBER_ALREADY_EXISTS,
        statusCode: 400,
      });
    }
    const checkEmailExists = await UserModel.findOne({ email });
    if (checkEmailExists) {
      return sendErrorResponse({
        res,
        message: enMessage.EMAIL_ALREADY_EXISTS,
        statusCode: 400,
      });
    }

    const user = await UserModel.create(data);
    return sendSuccessResponse({
      res,
      message: enMessage.SIGNUP_SUCCESS,
      statusCode: 200,
      data: user,
    });
  } catch (err) {
    return sendErrorResponse({ res, message: err, statusCode: 500 });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmailExists = await UserModel.findOne({ email });
    if (!checkEmailExists) {
      return sendErrorResponse({
        res,
        message: enMessage.EMAIL_NOT_FOUND,
        statusCode: 404,
      });
    }
    if (checkEmailExists && checkEmailExists.isOtpVerified === false) {
      return sendErrorResponse({
        res,
        message: "Your Profile not completed",
        statusCode: 401,
      });
    }
    const isMatch = await decrypt(password, checkEmailExists.password);
    if (!isMatch) {
      return sendErrorResponse({
        res,
        message: enMessage.INCORRECT_PASSWORD,
        statusCode: 401,
      });
    }
    const tokenData = {
      _id: checkEmailExists._id,
      email: checkEmailExists.email,
    };
    const token = await generateToken(tokenData);
    await UserModel.findByIdAndUpdate(checkEmailExists._id, {
      accessToken: token,
    });
    delete checkEmailExists.password;
    return sendSuccessResponse({
      res,
      message: enMessage.LOGIN_SUCCESS,
      statusCode: 200,
      data: {
        token,
        userData: checkEmailExists,
      },
    });
  } catch (err) {
    return sendErrorResponse({ res, message: err, statusCode: 500 });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { countryCode, mobileNumber } = req.body;
    const checkMobileExists = await UserModel.findOne({
      countryCode,
      mobileNumber,
    });
    if (checkMobileExists && checkMobileExists.isOtpVerified === false) {
      await UserModel.findByIdAndDelete(checkMobileExists._id);
    }
    if (checkMobileExists && checkMobileExists.isOtpVerified === true) {
      return sendErrorResponse({
        res,
        message: enMessage.MOBILE_NUMBER_ALREADY_EXISTS,
        statusCode: 400,
      });
    }

    let otp = "123456";
    let expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    let otpInfo = {
      otp,
      expiresAt,
    };
    const userData = await UserModel.create({
      countryCode,
      mobileNumber,
      otpInfo,
    });
    const tokenData = {
      _id: userData._id,
      mobileNumber: userData.mobileNumber,
      countryCode: userData.countryCode,
      otpInfo,
    };
    const token = await generateToken(tokenData);
    await UserModel.findByIdAndUpdate(userData._id, {
      accessToken: token,
    });
    return sendSuccessResponse({
      res,
      message: enMessage.OTP_SENT,
      statusCode: 200,
      data: {
        token,
        userData,
      },
    });
  } catch (error) {
    console.error(error);
    return sendErrorResponse({ res, message: error, statusCode: 500 });
  }
};

const verifyOtp = async (req, res) => {
  try {
    let { otp } = req.body;
    const userData = req.userData;
    if (new Date() > new Date(userData.otpInfo?.expiresAt)) {
      return sendErrorResponse({
        res,
        message: enMessage.OTP_EXPIRED,
        statusCode: 400,
      });
    }
    if (otp !== userData.otpInfo.otp) {
      return sendErrorResponse({
        res,
        message: enMessage.OTP_NOT_MATCHED,
        statusCode: 400,
      });
    }
    await UserModel.findByIdAndUpdate(userData._id, {
      isOtpVerified: true,
      otpInfo: null,
    });
    return sendSuccessResponse({
      res,
      message: enMessage.OTP_VERIFIED,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return sendErrorResponse({ res, message: error, statusCode: 500 });
  }
};

const completeProfileStep1 = async (req, res) => {
  try {
    const { countryCode, mobileNumber, email, password } = req.body;
    const userData = req.userData;
    const data = {
      email,
      password: await encrypt(password),
      countryCode,
      mobileNumber,
    };

    const userDatas = await UserModel.findByIdAndUpdate(userData._id, data, {
      new: true,
    });
    return sendSuccessResponse({
      res,
      message: enMessage.PROFILE_STEP_1_COMPLETED,
      statusCode: 200,
      data: userDatas,
    });
  } catch (error) {
    console.error(error);
    return sendErrorResponse({ res, message: error, statusCode: 500 });
  }
};

const completeProfileStep2 = async (req, res) => {
  try {
    const { whyUseService, whatDescribesBest, isWhatDescribesBest } = req.body;
    const userData = req.userData;
    const data = {
      whyUseService,
      whatDescribesBest,
      isWhatDescribesBest,
    };
    const updateUser = await UserModel.findByIdAndUpdate(userData._id, data, {
      new: true,
    });
    return sendSuccessResponse({
      res,
      message: enMessage.PROFILE_STEP_2_COMPLETED,
      statusCode: 200,
      data: updateUser,
    });
  } catch (error) {
    console.error(error);
    return sendErrorResponse({ res, message: error, statusCode: 500 });
  }
};
const completeProfileStep3 = async (req, res) => {
  try {
    const { companyName, businessDirection, noOfPeopleInTeam } = req.body;
    const userData = req.userData;
    const data = {
      companyName,
      businessDirection,
      noOfPeopleInTeam,
    };
    const updateUser = await UserModel.findByIdAndUpdate(userData._id, data, {
      new: true,
    });
    return sendSuccessResponse({
      res,
      message: enMessage.PROFILE_STEP_3_COMPLETED,
      statusCode: 200,
      data: updateUser,
    });
  } catch (error) {
    console.error(error);
    return sendErrorResponse({ res, message: error, statusCode: 500 });
  }
};

const completeProfileStep4 = async (req, res) => {
  try {
    const { membersEmail } = req.body;
    const userData = req.userData;
    const data = {
      membersEmail,
      isProfileCompleted: true,
    };
    const updateUser = await UserModel.findByIdAndUpdate(userData._id, data, {
      new: true,
    });
    return sendSuccessResponse({
      res,
      message: enMessage.PROFILE_STEP_4_COMPLETED,
      statusCode: 200,
      data: updateUser,
    });
  } catch (error) {
    console.error(error);
    return sendErrorResponse({ res, message: error, statusCode: 500 });
  }
};

module.exports = {
  signup,
  login,
  sendOtp,
  verifyOtp,
  completeProfileStep1,
  completeProfileStep2,
  completeProfileStep3,
  completeProfileStep4,
};
