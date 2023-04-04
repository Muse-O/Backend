const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
// const multer = require("multer");

// const { upload } = require("../middlewares/multer");
const ArtgramController = require("../controllers/artgram.controller");
const artgramController = new ArtgramController();

//아트그램 전체조회
router.get("/", artgramController.allArtgrams);
//아트그램 작성
router.post("/", authMiddleware, artgramController.postArtgram);
//아트그램 수정
router.patch("/:artgramId", authMiddleware, artgramController.modifyArtgram);
//아트그램 삭제
router.patch(
  "/:artgramId/remove",
  authMiddleware,
  artgramController.removeArtgram
);
//아트그램 좋아요등록/취소
router.patch(
  "/:artgramId/likes",
  authMiddleware,
  artgramController.likeArtgram
);
//아트그램 스크랩등록/취소
router.patch(
  "/:artgramId/scrap",
  authMiddleware,
  artgramController.scrapArtgram
);
// //댓글 작성
// router.post(
//   "/:artgramId/comments",
//   authMiddleware,
//   artgramController.commentCreate
// );
// //댓글 조회
// router.get(
//   "/:artgramId/comments",
//   authMiddleware,
//   artgramController.allComment
// );
// //댓글 수정
// router.patch(
//   "/:artgramId/comments/:commentId",
//   authMiddleware,
//   artgramController.modifyComment
// );
// //댓글 삭제
// router.patch(
//   "/:artgramId/comments/:commentId/remove",
//   artgramController.removeComment
// );
module.exports = router;
