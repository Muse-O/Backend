const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const ArtgramCommentController = require("../controllers/artgramComment.controller");
const artgramCommentController = new ArtgramCommentController();

/**
 * @swagger
 * /artgram/{artgramId}/comments:
 *   get:
 *     tags:
 *       - artgramComment
 *     summary: "아트그램 댓글조회"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램의 댓글을 조회합니다."
 *   post:
 *     tags:
 *       - artgramComment
 *     summary: "아트그램 댓글 생성"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *       - name: comment
 *         in: formData
 *         description: "댓글을 입력하는곳입니다."
 *         type: string
 *     responses:
 *       "200":
 *         description: "댓글을 생성하였습니다."
 *       "400":
 *         description: "오류"
 *     security:
 *       - jwt: []
 * /artgram/{artgramId}/comments/{commentId}:
 *   patch:
 *     tags:
 *       - artgramComment
 *     summary: "아트그램 댓글 수정"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         description: "0427c29e-b23e-4543-b16c-a483cced6264"
 *         required: true
 *         schema:
 *            type: string
 *       - name: comment
 *         in: formData
 *         description: "댓글을 적는 곳입니다."
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "댓글을 수정했습니다."
 * /artgram/{artgramId}/comments/{commentId}/remove:
 *   patch:
 *     tags:
 *       - artgramComment
 *     summary: "아트그램 댓글삭제"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "12806b45-533c-47ec-9fbc-3890dc131e7f"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         description: "0427c29e-b23e-4543-b16c-a483cced6264"
 *         required: true
 *         schema:
 *            type: string
 *     responses:
 *       "200":
 *         description: "아트그램이 삭제되었습니다."
 */

//댓글 작성
router.post(
  "/:artgramId/comments",
  authMiddleware,
  artgramCommentController.commentCreate
);
//댓글 조회
router.get("/:artgramId/comments", artgramCommentController.allComment);
//댓글 수정
router.patch(
  "/:artgramId/comments/:commentId",
  authMiddleware,
  artgramCommentController.modifyComment
);
//댓글 삭제
router.patch(
  "/:artgramId/comments/:commentId/remove",
  authMiddleware,
  artgramCommentController.removeComment
);

module.exports = router;
