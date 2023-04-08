const {
  Artgrams,
  ArtgramImg,
  Users,
  UserProfile,
  ArtgramLike,
  ArtgramScrap,
  ArtgramsComment,
} = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

class ArtgramCommentRepository extends ArtgramsComment {
  constructor() {
    super();
  }

  /**
   * 댓글작성
   * @param {string} userEmail
   * @param {string} comment
   * @param {string} artgramId
   * @returns 댓글작성결과 반환 createComments
   */
  commentCreate = async (userEmail, comment, artgramId) => {
    const createComments = await ArtgramsComment.create({
      userEmail,
      artgramId,
      comment,
    });
    return createComments;
  };

  /**
   * 댓글 전체조회
   * @param {string} artgramId
   * @returns artgramId에 해당하는 댓글전체반환 findArtgramComment
   */
  allComment = async (artgramId) => {
    const allEmail = await Artgrams.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["userEmail"],
      group: ["userEmail"],
    });

    const userEmail = allEmail.map((artgram) => artgram.dataValues.userEmail);
    const user = await Users.findOne({
      where: { userEmail: userEmail },
      include: [{ model: UserProfile }],
    });
    const profileNickname = user.UserProfile.dataValues.profileNickname;
    const profileImg = user.UserProfile.dataValues.profileImg;

    const findComment = await ArtgramsComment.findAll({
      where: {
        artgramId,
        commentStatus: {
          [Op.ne]: "CS04",
        },
      },
      attributes: ["comment", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const findArtgramComment = findComment.map((comment) => ({
      profileImg,
      profileNickname,
      comment: comment.comment,
      createdAt: comment.createdAt,
    }));
    return findArtgramComment;
  };

  /**
   * 댓글 수정
   * @param {string} userEmail
   * @param {string} comment
   * @param {string} artgramId
   * @param {string} commentId
   * @returns 댓글 수정결과반환 cngComment
   */
  modifyComment = async (userEmail, comment, artgramId, commentId) => {
    const cngComment = await ArtgramsComment.update(
      { comment },
      {
        where: {
          userEmail,
          artgramId,
          commentId,
        },
        // flelds: ["comment"],
      }
    );
    return cngComment;
  };

  /**
   * 댓글 삭제
   * @param {string} userEmail
   * @param {string} artgramId
   * @param {string} commentId
   * @returns 댓글 삭제결과 반환 deleteComment
   */
  removeComment = async (userEmail, artgramId, commentId) => {
    const deleteComment = await ArtgramsComment.update(
      { commentStatus: "CS04" },
      {
        where: { userEmail, artgramId, commentId },
        fields: ["commentStatus"],
      }
    );
    return deleteComment;
  };
}

module.exports = ArtgramCommentRepository;
