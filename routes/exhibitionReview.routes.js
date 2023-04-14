const express = require("express");
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const ExhibitionReviewController = require("../controllers/exhibitionReview.controller");

const exhibitionReviewController = new ExhibitionReviewController();

// 리뷰 목록 조회
router.get("/:exhibitionId/reviews/", exhibitionReviewController.searchExhibitionReviews);
// 특정 유저가 작성한 리뷰 조회
router.get("/reviews/user", exhibitionReviewController.searchReviewsByUser);
// 리뷰 등록
router.post("/reviews/write/:exhibitionId", authMiddleware, exhibitionReviewController.insertExhibitionReview);
// 리뷰 수정
router.patch("/reviews/write/:exhibitionReviewId", authMiddleware, exhibitionReviewController.updateExhibitionReview);
// 리뷰 삭제
router.delete("/reviews/delete/:exhibitionReviewId", authMiddleware, exhibitionReviewController.deleteExhibitionReview);

module.exports = router;