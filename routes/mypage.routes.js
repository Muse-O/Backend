const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const MypageController = require("../controllers/mypage.controller");
const mypageController = new MypageController();

router.get("/", authMiddleware, mypageController.getMyProfile);

router.patch("/", authMiddleware, mypageController.updateMyProfile);

// 작성한 전시회 조회
router.get("/exhibition", authMiddleware, mypageController.getMyExhibition);

// 좋아요 한 전시회 조회
router.get("/exhibition/likes", authMiddleware, mypageController.getMyLikedExhibition);

// 스크랩한 전시회 조회
router.get("/exhibition/scraps", authMiddleware, mypageController.getMyScrappedExhibition);

// 작성한 아트그램 조회
router.get("/artgram", authMiddleware, mypageController.getMyArtgram);

// 좋아요 한 아트그램 조회
router.get("/artgram/likes", authMiddleware, mypageController.getMyLikedArtgram);

// 스크랩한 아트그램 조회
router.get("/artgram/scraps", authMiddleware, mypageController.getMyScrappedArtgram);

module.exports = router;