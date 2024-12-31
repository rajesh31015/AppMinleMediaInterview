const { Joi } = require("celebrate");

const userValidation = {
  SIGNUP: Joi.object().keys({
    countryCode: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    whyUseService: Joi.string().required(),
    whatDescribesBest: Joi.string().required(),
    isWhatDescribesBest: Joi.string().required(),
    companyName: Joi.string().required(),
    businessDirection: Joi.string().required(),
    noOfPeopleInTeam: Joi.string().required(),
    membersEmail: Joi.array().required(),
  }),
  LOGIN: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { userValidation };
