const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const artgramRouter = require("./artgram.routes");

router.use("/user", userRouter);
router.use("/artgram", artgramRouter);

module.exports = router;
