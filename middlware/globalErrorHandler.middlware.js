const globalErrorHandler = (err, req, res, next) => {
  const message = err.message;
  const statusCode = err.statusCode || 500;
  const stack = err.stack;
  const status = err.status || "failed";
  let details = [];

  if (err.details) {
    err.details.forEach((error) => {
      details.push({
        field: error.path,
        message: error.message,
      });
    });
  }

  return res.status(statusCode).json({
    message,
    status,
    success: false,
    details,
    stack,
  });
};

const notFoundErr = (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  next(err);
};

module.exports = { globalErrorHandler, notFoundErr };
