const express = require("express");
const router = express.Router();

const BannerController = require("../controllers/banner.controller");
const bannerController = new BannerController();

// 현재 날짜에(한국 시간) 전시중인 전시회 중 좋아요 순 전시글
router.get("/getOpenExhibitionsSortedByMostLike", bannerController.getOpenExhibitionsSortedByMostLike);
// 현재 날짜에(한국 시간) 전시중인 전시회 중 작성일 최근순 전시글
router.get("/getOpenExhibitionsSortedByDate", bannerController.getOpenExhibitionsSortedByDate);
// 예정 전시회 중 가장 가까운 날짜 전시 중 좋아요 순
router.get("/getFutureExhibitionsSortedByNearest", bannerController.getFutureExhibitionsSortedByNearest);
// 최근 작성된 아트그램
router.get("/getLatestArtgrams", bannerController.getLatestArtgrams);

module.exports = router;