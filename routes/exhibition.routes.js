const express = require("express");
const router = express.Router();

const authLoginMiddleware = require('../middlewares/authLoginMiddleware');
const ExhibitionController = require("../controllers/exhibition.controller");
const CommonAPIController = require("../controllers/commonAPI.controller")

const exhibitionController = new ExhibitionController();
const commonAPIController = new CommonAPIController();

// 전시회 목록 조회
router.get("/exhibition", exhibitionController.getExhibitionList);
// 전시회 상세 조회
router.get("/exhibition/:exhibitionId", exhibitionController.getExhibitionDetail);
// 전시회 등록
router.post("/exhibition/write", exhibitionController.writeExhibition);
// 전시회 수정
router.patch("/exhibition/update/:exhibitionId", exhibitionController.updateExhibition);
// 전시회 삭제
router.delete("/exhibition/delete/:exhibitionId", exhibitionController.deleteExhibition);
// 전시회 스크랩
router.patch("/exhibitoin/scrap/:exhibitionId", exhibitionController.scrapExhibition);
// 전시회 좋아요
router.patch("/exhibitoin/like/:exhibitionId", exhibitionController.likeExhibition);
// 전시회 검색 -> Redis 리펙토링 예정
router.get("/exhibition/search", exhibitionController.searchExhibition);
// 전시회 카테고리 조회
router.get("/exhibition/category", commonAPIController.getCategory);
// 전시회 카테고리 검색
router.get("/exhibition/category/search", exhibitionController.searchCategoryExhibition);

module.exports = router;