const express = require("express");
const app = express();
const {
  globalErrorHandler,
  notFoundErr,
} = require("../middlware/globalErrorHandler.middlware");
const cors = require("../middlware/cors.middlware");
const {
  urlEncoded,
  jsonEncoded,
} = require("../middlware/bodyParse.middleware");
const indexRoute = require("../routes/index.routes");

app.use(cors());
app.use(urlEncoded);
app.use(jsonEncoded);
app.use("/api/v1/", indexRoute);
app.use(notFoundErr);
app.use(globalErrorHandler);

module.exports = app;
