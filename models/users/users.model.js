const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  countryCode: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  otpInfo: {
    otp: String,
    expiresAt: Number,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
  isProfileCompleted: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },

  whyUseService: {
    type: String,
    // required: true,
    enum: ["Work", , "Personal", "Other"],
  },
  whatDescribesBest: {
    type: String,
    // required: true,
    enum: ["Business Owner"],
  },
  isWhatDescribesBest: {
    type: String,
    default: "No",
    enum: ["Yes", "No"],
  },
  companyName: {
    type: String,
    // required: true,
  },
  businessDirection: {
    type: String,
    // required: true,
    enum: ["Corporate", "Startup", "Small Business", "It And Programming"],
  },
  noOfPeopleInTeam: {
    type: String,
    default: "Only Me",
    enum: [
      "Only Me",
      "2-5",
      "6-10",
      "11-20",
      "21-30",
      "31-40",
      "41-50",
      "51-100",
      "101-500",
    ],
  },
  membersEmail: {
    type: Object,
    // required: true,
  },
  accessToken: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  updatedAt: {
    type: Number,
    default: new Date().getTime(),
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
