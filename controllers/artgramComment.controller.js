const ArtgramCommentService = require("../services/artgramComment.service");
const Joi = require("joi");

const commentSchema = Joi.object({
  comment: Joi.string().required().messages({
    "string.empty": "comment(댓글)을 문자열로 입력해주세요",
    "any.required": "comment(댓글)값이 요청 파라미터로 전달되지않았습니다.",
  }),
});
class ArtgramCommentController {
  constructor() {
    this.artgramCommentService = new ArtgramCommentService();
  }

  //댓글작성
  commentCreate = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const validatedData = await commentSchema
        .validateAsync(req.body)
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
      const { artgramId } = req.params;

      const artgramcomment = await this.artgramCommentService.commentCreate(
        userEmail,
        validatedData,
        artgramId
      );
      res.status(200).json({ message: "댓글이 작성되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  //댓글 전체조회
  allComment = async (req, res, next) => {
    try {
      const { artgramId } = req.params;
      const createArtgram = await this.artgramCommentService.allComment(
        artgramId
      );
      res.status(200).json({ comment: createArtgram });
    } catch (error) {
      next(error);
    }
  };

  //댓글 수정
  modifyComment = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const validatedData = await commentSchema
        .validateAsync(req.body)
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
      const { artgramId, commentId } = req.params;
      const createArtgram = await this.artgramCommentService.modifyComment(
        userEmail,
        validatedData,
        artgramId,
        commentId
      );
      res.status(200).json({ message: "댓글이 수정되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  //댓글 삭제
  removeComment = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { artgramId, commentId } = req.params;
      const createArtgram = await this.artgramCommentService.removeComment(
        userEmail,
        artgramId,
        commentId
      );
      res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ArtgramCommentController;
