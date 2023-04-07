const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const MypageController = require("../controllers/mypage.controller");
const mypageController = new MypageController();

router.get("/", authMiddleware, mypageController.getMyProfile);

router.patch("/", authMiddleware, mypageController.updateMyProfile);

module.exports = router;