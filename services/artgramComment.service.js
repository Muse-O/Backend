const ArtgramCommentRepository = require("../repositories/artgramComment.repository");
const Boom = require("boom");

class ArtgramCommentService {
  constructor() {
    this.artgramCommentRepository = new ArtgramCommentRepository();
  }

  /**
   * 댓글 작성
   * @param {string} userEmail
   * @param {commentSchema} validatedData 검증된 댓글객체{ comment }
   * @param {string} artgramId
   * @returns 댓글작성결과
   */
  commentCreate = async (userEmail, validatedData, artgramId) => {
    const { comment } = validatedData;
    const artgramcomment = await this.artgramCommentRepository.commentCreate(
      userEmail,
      comment,
      artgramId
    );

    return artgramcomment;
  };

  /**
   * 댓글 전체조회
   * @param {string} artgramId
   * @returns artgramId에 해당하는 댓글 전체조회목록
   */
  allComment = async (artgramId) => {
    const findComment = await this.artgramCommentRepository.allComment(
      artgramId
    );
    return findComment;
  };

  /**
   * 댓글 수정
   * @param {string} userEmail
   * @param {commentSchema} validatedData
   * @param {string} artgramId
   * @param {string} commentId
   * @returns 댓글수정결과
   */
  modifyComment = async (userEmail, validatedData, artgramId, commentId) => {
    const { comment } = validatedData;
    const cngComment = await this.artgramCommentRepository.modifyComment(
      userEmail,
      comment,
      artgramId,
      commentId
    );
    if (cngComment[0] === 0) {
      throw Boom.notFound(
        "게시글 삭제에 실패했습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
      );
    }
    return cngComment;
  };

  /**
   * 댓글 삭제
   * @param {string} userEmail
   * @param {string} artgramId
   * @param {string} commentId
   * @returns 댓글 삭제결과
   */
  removeComment = async (userEmail, artgramId, commentId) => {
    const deleteComment = await this.artgramCommentRepository.removeComment(
      userEmail,
      artgramId,
      commentId
    );
    if (deleteComment[0] === 0) {
      throw Boom.notFound(
        "게시글 삭제에 실패했습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
      );
    }
    return deleteComment;
  };

  /**
   * 답글 조회
   * @param {string} artgramId
   * @param {string} commentId
   * @returns 답글조회 결과값반환
   */
  allReply = async (artgramId, commentId) => {
    const findAllReply = await this.artgramCommentRepository.allReply(
      artgramId,
      commentId
    );
    return findAllReply;
  };

  /**
   * 답글 작성
   * @param {string} artgramId
   * @param {string} commentId
   * @param {commentSchema} validatedData
   * @returns 답글작성 결과 반환
   */
  replyCreate = async (userEmail, artgramId, commentId, validatedData) => {
    const { comment } = validatedData;
    const createReply = await this.artgramCommentRepository.replyCreate(
      userEmail,
      artgramId,
      commentId,
      comment
    );
    return createReply;
  };

  /**
   * 답글 수정
   * @param {string} artgramId
   * @param {string} commentId
   * @param {string} commentParent
   * @param {commentSchema} validatedData
   * @returns 답글 수정결과 반환
   */
  updateReply = async (
    userEmail,
    artgramId,
    commentId,
    commentParent,
    validatedData
  ) => {
    const { comment } = validatedData;
    const replyUpdate = await this.artgramCommentRepository.updateReply(
      userEmail,
      artgramId,
      commentId,
      commentParent,
      comment
    );
    return replyUpdate;
  };

  /**
   * 답글 삭제
   * @param {string} artgramId
   * @param {string} commentId
   * @param {string} commentParent
   * @returns 답글 삭제결과 반환
   */
  deleteReply = async (userEmail, artgramId, commentId, commentParent) => {
    const replyDelete = await this.artgramCommentRepository.deleteReply(
      userEmail,
      artgramId,
      commentId,
      commentParent
    );
    return replyDelete;
  };
}
module.exports = ArtgramCommentService;
