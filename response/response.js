const sendSuccessResponse = ({ res, message, statusCode = 200, data = [] }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendErrorResponse = ({ res, message, statusCode = 500, data = [] }) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
