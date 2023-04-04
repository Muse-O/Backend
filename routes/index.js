const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const artgramRouter = require("./artgram.routes");
const exhibitionRouter = require("./exhibition.routes");

router.use("/user", userRouter);
router.use("/artgram", artgramRouter);
router.use("/exhibition", exhibitionRouter)

module.exports = router;
