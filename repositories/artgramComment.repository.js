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
   * 아트그램 게시글 댓글 작성 시 작성자에게 알림 발송하기 위해 작성자 조회
   * @param {string} artgramId
   * @returns 아트그램 게시글 작성자 이메일
   */
  findNotiReceiver = async (artgramId) => {
    const author = await Artgrams.findByPk(artgramId, {
      attributes: ["user_email"],
    });

    return author.dataValues.user_email;
  };

  /**
   * 아트그램 게시글 답글 작성 시 댓글 작성자에게 알림 발송하기 위해 작성자 조회
   * @param {string} artgramId
   * @returns 댓글 작성자 이메일
   */
  findreplyNotiReceiver = async (commentId) => {
    const author = await ArtgramsComment.findByPk(commentId, {
      attributes: ["user_email"],
    });

    return author.dataValues.user_email;
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
    const user = await Users.findAll({
      where: { userEmail: userEmail },
      include: [
        { model: UserProfile, attributes: ["profileNickname", "profileImg"] },
      ],
    });

    const findComment = await ArtgramsComment.findAll({
      where: {
        artgramId,
        [Op.or]: [
          // Move the Op.or outside of the commentParent object
          { commentParent: null },
        ],
        commentStatus: {
          [Op.ne]: "CS04",
        },
      },
      attributes: [
        "commentId",
        "userEmail",
        "comment",
        "createdAt",
        "commentParent",
      ],
      order: [["createdAt", "DESC"]],
    });

    const findArtgramComment = [];

    for (const comment of findComment) {
      if (comment.commentParent !== null && comment.commentParent !== 0) {
        continue;
      }

      const userProfile = user.find(
        (u) => u.userEmail === comment.userEmail
      )?.UserProfile;
      const profileNickname = userProfile?.profileNickname ?? null;
      const profileImg = userProfile?.profileImg ?? null;

      const replyCount =
        (await ArtgramsComment.count({
          where: {
            commentParent: comment.commentId,
          },
        })) || 0;

      findArtgramComment.push({
        commentId: comment.commentId,
        userEmail: comment.userEmail,
        profileImg,
        profileNickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        replyCount,
      });
    }

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

  /**
   * 답글 조회
   * @param {string} artgramId
   * @param {string} commentId
   * @returns 답글 조회결과 반환 findReplyComment
   */
  allReply = async (artgramId, commentId) => {
    //모든 유저 이메일 조회
    //추후에 가져온 artgramId와 commentId를 사용해서 아트그램의id에 해당하는
    //댓글, 답글의 userEmail만 불러오도록 리펙토링 최대한 필요한만큼만의 데이터를 가져오기위해서
    const allEmail = await ArtgramsComment.findAll({
      where: { artgramId },
      order: [["createdAt", "DESC"]],
      attributes: ["userEmail"],
      group: ["userEmail"],
    });
    const userEmail = allEmail.map((Reply) => Reply.dataValues.userEmail);

    const findAllReply = await ArtgramsComment.findAll({
      where: {
        artgramId,
        commentStatus: {
          [Op.ne]: "CS04",
        },
        commentParent: {
          [Op.ne]: null,
          [Op.eq]: commentId, // commentParent와 commentId가 일치
        },
        userEmail: {
          [Op.in]: userEmail,
        },
      },
      attributes: [
        "commentId",
        "commentParent",
        "userEmail",
        "comment",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    const findArtgramReply = [];

    //반복문으로 userEmail에 해당하는 UserProfile조회
    for (const comment of findAllReply) {
      const user = await Users.findOne({
        where: { userEmail: comment.userEmail },
        include: [{ model: UserProfile }],
      });

      const userProfile = user.UserProfile;
      const profileNickname = userProfile?.profileNickname ?? null;
      const profileImg = userProfile?.profileImg ?? null;

      findArtgramReply.push({
        commentId: comment.commentId,
        userEmail: comment.userEmail,
        profileImg,
        profileNickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        commentParent: comment.commentParent,
      });
    }

    return findArtgramReply;
  };

  /**
   * 답글 작성
   * @param {string} userEmail
   * @param {string} artgramId
   * @param {string} commentId
   * @param {string} comment
   * @returns 답글 생성결과 반환 createReply
   */
  replyCreate = async (userEmail, artgramId, commentId, comment) => {
    const createReply = await ArtgramsComment.create({
      where: { artgramId, userEmail, commentId },
      artgramId,
      commentParent: commentId,
      userEmail,
      comment,
    });
    return createReply;
  };

  /**
   * 답글 수정
   * @param {string} userEmail
   * @param {string} artgramId
   * @param {string} commentId
   * @param {string} commentParent
   * @param {string} comment
   * @returns 답글 수정결과 반환 updatereply
   */
  updateReply = async (
    userEmail,
    artgramId,
    commentId,
    commentParent,
    comment
  ) => {
    const updatereply = await ArtgramsComment.update(
      { comment },
      {
        where: { userEmail, artgramId, commentId, commentParent },
      }
    );
    return updatereply;
  };

  /**
   * 답글 삭제
   * @param {string} userEmail
   * @param {string} artgramId
   * @param {string} commentId
   * @param {string} commentParent
   * @returns 답글 삭제결과 반환
   */
  deleteReply = async (userEmail, artgramId, commentId, commentParent) => {
    const deletereply = await ArtgramsComment.update(
      { commentStatus: "CS04" },
      {
        where: { userEmail, artgramId, commentId, commentParent },
        fields: ["commentStatus"],
      }
    );
    return deletereply;
  };
}

module.exports = ArtgramCommentRepository;
