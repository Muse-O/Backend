const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const artgramRouter = require("./artgram.routes");
const artgramCommentRouter = require("./artgramComment.routes");

router.use("/user", userRouter);
router.use("/artgram", [artgramRouter, artgramCommentRouter]);

module.exports = router;
