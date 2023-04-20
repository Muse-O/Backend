const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const artgramRouter = require("./artgram.routes");
const artgramCommentRouter = require("./artgramComment.routes");
const exhibitionRouter = require("./exhibition.routes");
const exhibitionReviewRouter = require("./exhibitionReview.routes");
const mypageRouter = require("./mypage.routes");
<<<<<<< Updated upstream
const searchRouter = require("./search.routes");
const bannerRouter = require("./banner.routes");
const notiRouter = require("./notification.routes")

router.use("/auth", userRouter);
router.use("/artgram", [artgramRouter, artgramCommentRouter]);
=======
<<<<<<< Updated upstream

router.use("/auth", userRouter);
router.use("/artgram", [artgramRouter, artgramCommentRouter]);
router.use("/exhibition", exhibitionRouter);
router.use("/mypage", mypageRouter)
=======
const searchRouter = require("./search.routes");
const bannerRouter = require("./banner.routes");
const notiRouter = require("./notification.routes");
const reportRouter = require("./report.routes");
const adminRouter = require("./admin.routes");

router.use("/auth", userRouter);
router.use("/artgram", [artgramRouter, artgramCommentRouter]);
>>>>>>> Stashed changes
router.use("/exhibition", [exhibitionRouter, exhibitionReviewRouter]);
router.use("/mypage", mypageRouter);
router.use("/search", searchRouter);
router.use("/banner", bannerRouter);
router.use("/notification", notiRouter);
<<<<<<< Updated upstream
=======
router.use("/report", reportRouter);
// router.use("/admin", adminRouter)
>>>>>>> Stashed changes
>>>>>>> Stashed changes

module.exports = router;
