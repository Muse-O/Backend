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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: "댓글을 입력하는 곳입니다"
 *             required:
 *               - comment
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: "댓글을 입력하는 곳입니다"
 *             required:
 *               - comment
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
 *
 * /artgram/{artgramId}/comments/{commentId}/reply:
 *   get:
 *     tags:
 *       - artgramReply
 *     summary: "아트그램 답글조회"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "ba63d06b-b865-4984-88a9-3f4e5a5d0197"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         description: "4ce93f0f-7082-4436-b8db-814d4a521097"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: "아트그램의 답글을 조회합니다."
 *   post:
 *     tags:
 *       - artgramReply
 *     summary: "아트그램 답글 생성"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "ba63d06b-b865-4984-88a9-3f4e5a5d0197"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         description: "4ce93f0f-7082-4436-b8db-814d4a521097"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: "답글을 입력하는 곳입니다"
 *             required:
 *               - comment
 *     responses:
 *       "200":
 *         description: "답글을 생성하였습니다."
 *       "400":
 *         description: "오류"
 *     security:
 *       - jwt: []
 * /artgram/{artgramId}/comments/{commentId}/reply/{commentParent}:
 *   patch:
 *     tags:
 *       - artgramReply
 *     summary: "아트그램 답글 수정"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "ba63d06b-b865-4984-88a9-3f4e5a5d0197"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         description: "4ce93f0f-7082-4436-b8db-814d4a521097"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentParent
 *         in: path
 *         description: "4ce93f0f-7082-4436-b8db-814d4a521097"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: "답글을 입력하는 곳입니다"
 *             required:
 *               - comment
 *     responses:
 *       "200":
 *         description: "답글을 수정했습니다."
 *     security:
 *       - jwt: []
 * /artgram/{artgramId}/comments/{commentId}/reply/{commentParent}/remove:
 *   patch:
 *     tags:
 *       - artgramReply
 *     summary: "아트그램 답글 삭제"
 *     parameters:
 *       - name: artgramId
 *         in: path
 *         description: "ba63d06b-b865-4984-88a9-3f4e5a5d0197"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         description: "4ce93f0f-7082-4436-b8db-814d4a521097"
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentParent
 *         in: path
 *         description: "4ce93f0f-7082-4436-b8db-814d4a521097"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: "답글을 입력하는 곳입니다"
 *             required:
 *               - comment
 *     responses:
 *       "200":
 *         description: "답글을 삭제했습니다."
 *     security:
 *       - jwt: []
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
//답글 조회
router.get(
  "/:artgramId/comments/:commentId/reply",
  artgramCommentController.allReply
);
//답글 작성
router.post(
  "/:artgramId/comments/:commentId/reply",
  authMiddleware,
  artgramCommentController.replyCreate
);
//답글 수정
router.patch(
  "/:artgramId/comments/:commentParent/reply/:commentId",
  authMiddleware,
  artgramCommentController.updateReply
);
//답글 삭제
router.patch(
  "/:artgramId/comments/:commentParent/reply/:commentId/remove",
  authMiddleware,
  artgramCommentController.deleteReply
);

module.exports = router;
