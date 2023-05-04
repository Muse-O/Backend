const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const artgramAuthMiddleware = require("../middlewares/authMiddleware_public");

const ArtgramController = require("../controllers/artgram.controller");
const artgramController = new ArtgramController();

/**
 * @swagger
 * /artgram?limit=10&offset=0:
 *   get:
 *     tags:
 *       - artgram
 *     summary: "전체 아트그램 조회"
 *     responses:
 *       "200":
 *         description: "아트그램의 전체목록을 조회합니다"
 * /artgram:
 *   post:
 *     tags:
 *       - artgram
 *     summary: "아트그램 생성"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imgUrl:
 *                 type: string
 *                 description: "이미지 Url을 입력하는 곳입니다"
 *               artgramTitle:
 *                 type: string
 *                 description: "아트그램의 제목을 입력하는 곳입니다."
 *               artgramDesc:
 *                 type: string
 *                 description: "아트그램의 내용을 입력하는 부분입니다."
 *             required:
 *               - artgramTitle
 *               - artgramDesc
 *     responses:
 *       "200":
 *         description: "아트그램을 생성하였습니다."
 *       "400":
 *         description: "오류"
 *     security:
 *       - jwt: []
 * /artgram/{artgramId}:
 *   get:
 *    tags:
 *      - artgram
 *    summary: "아트그램 상세조회"
 *    parameters:
 *     - name: artgramId
 *       in: path
 *       description: "3cdc5810-a5ed-4b39-a013-f027a0f7d54d"
 *       required: true
 *       schema:
 *         type: string
 *    responses:
 *      "200":
 *        description: "아트그램 상세정보를 조회합니다"
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 수정"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "3cdc5810-a5ed-4b39-a013-f027a0f7d54d"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artgramTitle:
 *                 type: string
 *                 description: "아트그램의 제목을 적는 곳입니다."
 *               artgramDesc:
 *                 type: string
 *                 description: "아트그램의 내용을 적는 곳입니다."
 *             required:
 *               - artgramTitle
 *               - artgramDesc
 *     responses:
 *       "200":
 *         description: "아트그램을 수정했습니다."
 *     security:
 *       - jwt: []
 * /artgram/{artgramId}/remove:
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 삭제"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "3cdc5810-a5ed-4b39-a013-f027a0f7d54d"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램이 삭제되었습니다."
 *     security:
 *       - jwt: []

 * /artgram/{artgramId}/likes:
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 좋아요등록/취소"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "3cdc5810-a5ed-4b39-a013-f027a0f7d54d"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램의 좋아요 등록/취소 되었습니다."
 *     security:
 *       - jwt: []
 * /artgram/{artgramId}/scrap:
 *   patch:
 *     tags:
 *       - artgram
 *     summary: "아트그램 스크랩등록/취소"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "3cdc5810-a5ed-4b39-a013-f027a0f7d54d"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램의 스크랩 등록/취소 되었습니다."
 *     security:
 *       - jwt: []
 */

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
