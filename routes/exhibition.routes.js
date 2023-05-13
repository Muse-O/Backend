const express = require("express");
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const publicAuthMiddleware = require("../middlewares/authMiddleware_public");
const ExhibitionController = require("../controllers/exhibition.controller");
const CommonAPIController = require("../controllers/commonAPI.controller")

const exhibitionController = new ExhibitionController();
const commonAPIController = new CommonAPIController();

// 전시회 목록 조회
router.get("/", publicAuthMiddleware, exhibitionController.getExhibitionList);
// 전시회 상세 조회
router.get("/view/:exhibitionId", publicAuthMiddleware, exhibitionController.getExhibitionDetail);
// 전시회 등록
router.post("/", authMiddleware, exhibitionController.writeExhibition);
// 전시회 수정
router.patch("/:exhibitionId", authMiddleware, exhibitionController.updateExhibition);
// 전시회 삭제
router.delete("/:exhibitionId", authMiddleware, exhibitionController.deleteExhibition);
// 전시회 스크랩
router.patch("/:exhibitionId/scrap", authMiddleware, exhibitionController.scrapExhibition);
// 전시회 좋아요
router.patch("/:exhibitionId/like", authMiddleware, exhibitionController.likeExhibition);
// 전시회 카테고리 조회
router.get("/categories", commonAPIController.getCategory);
// 전시회 카테고리 검색
router.get("/categories/search", publicAuthMiddleware, exhibitionController.searchCategoryExhibition);
// 전시 TOP 10 태그 검색
router.get("/top-tags", exhibitionController.getTopTags);

module.exports = router;