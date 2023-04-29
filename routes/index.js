const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const artgramRouter = require("./artgram.routes");
const artgramCommentRouter = require("./artgramComment.routes");
const exhibitionRouter = require("./exhibition.routes");
const exhibitionReviewRouter = require("./exhibitionReview.routes");
const mypageRouter = require("./mypage.routes");
const searchRouter = require("./search.routes");
const bannerRouter = require("./banner.routes");
const notiRouter = require("./notification.routes");
const reportRouter = require("./report.routes");
const adminRouter = require("./admin.routes");
const chatRouter = require("./chat.routes");

router.use("/auth", userRouter);
router.use("/artgram", [artgramRouter, artgramCommentRouter]);
router.use("/exhibition", [exhibitionRouter, exhibitionReviewRouter]);
router.use("/mypage", mypageRouter);
router.use("/search", searchRouter);
router.use("/banner", bannerRouter);
router.use("/notification", notiRouter);
router.use("/report", reportRouter);
router.use("/admin", adminRouter);
router.use("/chat", chatRouter);

module.exports = router;
