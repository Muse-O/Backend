const ArtgramCommentRepository = require("../repositories/artgramComment.repository");
const Boom = require("boom");

class ArtgramCommentService {
  constructor() {
    this.artgramCommentRepository = new ArtgramCommentRepository();
  }

  //댓글 작성
  commentCreate = async (userEmail, comment, artgramId) => {
    const artgramcomment = await this.artgramCommentRepository.commentCreate(
      userEmail,
      comment,
      artgramId
    );
    return artgramcomment;
  };

  //댓글 전체조회
  allComment = async (artgramId) => {
    const findComment = await this.artgramCommentRepository.allComment(
      artgramId
    );
    return findComment;
  };

  //댓글 수정
  modifyComment = async (userEmail, comment, artgramId, commentId) => {
    const cngComment = await this.artgramCommentRepository.modifyComment(
      userEmail,
      comment,
      artgramId,
      commentId
    );
    return cngComment;
  };

  //댓글 삭제
  removeComment = async (userEmail, artgramId, commentId) => {
    const deleteComment = await this.artgramCommentRepository.removeComment(
      userEmail,
      artgramId,
      commentId
    );
    return deleteComment;
  };
}
module.exports = ArtgramCommentService;
