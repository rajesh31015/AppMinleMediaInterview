const express = require("express");
const router = express.Router();
const userRouter = require("./user/index.routes");

router.use("/users", userRouter);

module.exports = router;
