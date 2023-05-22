const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const artgramAuthMiddleware = require("../middlewares/authMiddleware_public");

const ArtgramController = require("../controllers/artgram.controller");
const artgramController = new ArtgramController();

//아트그램 전체조회
router.get("/", artgramAuthMiddleware, artgramController.loadAllArtgrams);

//아트그램 상세조회
router.get(
  "/:artgramId",
  artgramAuthMiddleware,
  artgramController.loadDetailArtgram
);

//아트그램 작성
router.post("/", authMiddleware, artgramController.creatingAnArtgram);
//아트그램 수정
router.patch("/:artgramId", authMiddleware, artgramController.ArtgramToModify);
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
  artgramController.artgramWithLike
);
//아트그램 스크랩등록/취소
router.patch(
  "/:artgramId/scrap",
  authMiddleware,
  artgramController.artgramWithScrap
);

module.exports = router;
