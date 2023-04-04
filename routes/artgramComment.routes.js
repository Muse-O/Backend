const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const ArtgramCommentController = require("../controllers/artgramComment.controller");
const artgramCommentController = new ArtgramCommentController();

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
