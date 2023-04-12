const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const artgramRouter = require("./artgram.routes");
const artgramCommentRouter = require("./artgramComment.routes");
const exhibitionRouter = require("./exhibition.routes");
const mypageRouter = require("./mypage.routes");
const searchRouter = require("./search.routes");
const bannerRouter = require("./banner.routes");

router.use("/auth", userRouter);
router.use("/artgram", [artgramRouter, artgramCommentRouter]);
router.use("/exhibition", exhibitionRouter);
router.use("/mypage", mypageRouter);
router.use("/banner", bannerRouter);
// router.use("/search", searchRouter);

module.exports = router;
