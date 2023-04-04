const ArtgramCommentService = require("../services/artgramComment.service");

class ArtgramCommentController {
  constructor() {
    this.artgramCommentService = new ArtgramCommentService();
  }

  //댓글작성
  commentCreate = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { comment } = req.body;
      const { artgramId } = req.params;

      const artgramcomment = await this.artgramCommentService.commentCreate(
        userEmail,
        comment,
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
    // try {
    const { userEmail } = res.locals.user;
    const { comment } = req.body;
    const { artgramId, commentId } = req.params;
    const createArtgram = await this.artgramCommentService.modifyComment(
      userEmail,
      comment,
      artgramId,
      commentId
    );
    res.status(200).json({ message: "댓글이 수정되었습니다." });
    // } catch (error) {
    //   next(error)
    // }
  };

  //댓글 삭제
  removeComment = async (req, res, next) => {
    // try {
    const { userEmail } = res.locals.user;
    const { artgramId, commentId } = req.params;
    const createArtgram = await this.artgramCommentService.removeComment(
      userEmail,
      artgramId,
      commentId
    );
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
    // } catch (error) {}
  };
}

module.exports = ArtgramCommentController;
