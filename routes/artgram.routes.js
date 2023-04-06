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
 *     tags:
 *       - artgram
 *     summary: "전체 아트그램 조회"
 *     responses:
 *       "200":
 *         description: "아트그램의 전체목록을 조회합니다"
 * /artgram/{artgramId}:
 *   post:
 *     tags:
 *       - artgram
 *     summary: "아트그램 생성"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *       - name: imgUrl
 *         in: formData
 *         description: "이미지 Url을 입력하는 곳입니다"
 *         type: string
 *       - name: artgramTitle
 *         in: formData
 *         description: "아트그램의 제목을 입력하는 곳입니다."
 *         required: true
 *         type: string
 *       - name: artgramDesc
 *         in: formData
 *         description: "아트그램의 내용을 입력하는 부분입니다."
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "아트그램을 생성하였습니다."
 *       "400":
 *         description: "오류"
 *     security:
 *       - jwt: []
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 수정"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *       - name: artgramTitle
 *         in: formData
 *         description: "아트그램의 제목을 적는 곳입니다."
 *         required: true
 *         type: string
 *       - name: artgramDesc
 *         in: formData
 *         description: "아트그램의 내용을 적는 곳입니다."
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "아트그램을 수정했습니다."
 * /artgram/{artgramId}/remove:
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 삭제"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램이 삭제되었습니다."
 * /artgram/{artgramId}/likes:
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 좋아요등록/취소"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램의 좋아요 등록/취소 되었습니다."
 * /artgram/{artgramId}/scrap:
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 스크랩등록/취소"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램의 스크랩 등록/취소 되었습니다."
 */

//아트그램 전체조회
router.get("/", artgramController.allArtgrams);

//제한하지않고
//아트그램 작성
router.post("/:artgramId", authMiddleware, artgramController.postArtgram);
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
