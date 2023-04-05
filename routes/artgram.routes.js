const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const { upload } = require("../middlewares/multer");
const ArtgramController = require("../controllers/artgram.controller");
const artgramController = new ArtgramController();

/**
 * @swagger
 * /artgram:
 *   get:
 *     summary: Get all artgrams
 *     description: Retrieve a list of all artgrams
 *     responses:
 *       200:
 *         description: A list of artgrams
 */
//아트그램 전체조회
router.get("/", artgramController.allArtgrams);
//아트그램 작성
router.post(
  "/:artgramId",
  upload.array("imgUrl", 5),
  authMiddleware,
  artgramController.postArtgram
);
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

module.exports = router;
