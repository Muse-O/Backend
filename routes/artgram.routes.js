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
 *     summary: "Search all Artgrams"
 *     responses:
 *       "200":
 *         description: "Retrieves all artgrams."
 * /artgram/{artgramId}:
 *   post:
 *     summary: "Create artgram"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *       - name: imgUrl
 *         in: formData
 *         description: "Url of the artgram image"
 *         type: string
 *       - name: artgramTitle
 *         in: formData
 *         description: "Title of the artgram"
 *         required: true
 *         type: string
 *       - name: artgramDesc
 *         in: formData
 *         description: "Description of the artgram"
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "Artgram created"
 *       "400":
 *         description: "Invalid input"
 *     security:
 *       - jwt: []
 *   patch:
 *     summary: "Modify artgram"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *       - name: artgramTitle
 *         in: formData
 *         description: "Title of the artgram"
 *         required: true
 *         type: string
 *       - name: artgramDesc
 *         in: formData
 *         description: "Description of the artgram"
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "Modify an artgram."
 * /artgram/{artgramId}/remove:
 *   patch:
 *     summary: "Remove artgram"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "Remove an artgram."
 * /artgram/{artgramId}/likes:
 *   patch:
 *     summary: "Register or cancel Artgram like"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "Register or cancel an Artgram like."
 * /artgram/{artgramId}/scrap:
 *   patch:
 *     summary: "Register or cancel Artgram scrap"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "Register or cancel an Artgram scrap."
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
