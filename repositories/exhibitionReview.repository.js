const {
  ExhibitionReviews,
  ExhibitionHashtag,
  Users,
  UserProfile,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

class ExhibitionReviewRepository {
  /**
   * 리뷰 등록
   * @param {string} exhibitionId
   * @param {string} userEmail
   * @param {object} reviewItem 리뷰 입력 정보
   * @returns insertExhibitionReview 입력된 리뷰 정보
   */
  insertExhibitionReview = async (exhibitionId, userEmail, reviewItem) => {
    // 입력 받을 데이터
    // reviewObj = {
    //   reviewComment: '감성적인 전시회',
    //   reviewRating: 5
    // }

    const insertExhibitionReview = await ExhibitionReviews.create({
      exhibitionId,
      userEmail,
      ...reviewItem,
    });

    return insertExhibitionReview;
  };

  /**
   * 해쉬태그 등록
   * @param {string} exhibitionId
   * @param {string} exhibitionReviewId
   * @param {string} userEmail
   * @param {array<object>} hashTags
   * @returns insertExhibitionHashTag 입력된 해쉬 태그 객체 배열 정보
   */
  insertExhibitionHashTag = async (
    hashTags
  ) => {
    // 입력 받을 데이터
    // hashTags: [{exhibitionId, exhibitionReviewId, userEmail, tagName: '감성'},
    //            {exhibitionId, exhibitionReviewId, userEmail, tagName: '피카소'}]

    const insertExhibitionHashTag = await ExhibitionHashtag.bulkCreate(
      hashTags
    );

    return insertExhibitionHashTag;
  };

  /**
   * 리뷰 수정
   * @param {string} exhibitionReviewId
   * @param {string} userEmail
   * @param {object} reviewItem
   * @returns putExhibitionReview 수정된 리뷰 개수
   */
  putExhibitionReview = async (exhibitionReviewId, userEmail, reviewItem) => {
    // 입력 받을 데이터
    // reviewObj = {
    //   [reviewComment]: '감성적인 전시회',
    //   [reviewRating]: 5
    // }

    const putExhibitionReview = await ExhibitionReviews.update(
      {
        ...reviewItem,
      },
      {
        where: {
          [Op.and]: [{ exhibitionReviewId }, { userEmail }],
        },
      }
    );
    return putExhibitionReview;
  };

  /**
   * 리뷰 삭제
   * @param {string} exhibitionReviewId
   * @param {string} userEmail
   * @returns deleteExhibitionReview 삭제된 리뷰 개수
   */
  deleteExhibitionReview = async (exhibitionReviewId, userEmail) => {
    // 입력 받을 데이터
    // exhibitionReviewId, userEmail

    const deleteExhibitionReview = await ExhibitionReviews.update(
      {
        reviewStatus: "RS04",
      },
      {
        where: { [Op.and]: [{ exhibitionReviewId }, { userEmail }] },
      }
    );

    return deleteExhibitionReview;
  };

  /**
   * 해시태그 삭제
   * @param {string} exhibitionReviewId
   * @param {string} userEmail
   * @returns deleteExhibitionReview 삭제된 리뷰 개수
   */
  deleteExhibitionHashTag = async (exhibitionReviewId, userEmail) => {
    // 입력 받을 데이터
    // exhibitionReviewId, userEmail

    const deleteExhibitionHashTag = await ExhibitionHashtag.update(
      {
        isUse: "N",
      },
      {
        where: { [Op.and]: [{ exhibitionReviewId }, { userEmail }] },
      }
    );

    return deleteExhibitionHashTag;
  };

  /**
   * 리뷰 조회
   * @param {string} exhibitionId
   * @param {number} limit
   * @param {number} offset
   * @returns {searchExhibitionReviews, paginationInfo} 검색된 리뷰 레코드 배열
   */
  searchExhibitionReviews = async (exhibitionId, limit, offset) => {
    // 입력 받을 데이터
    // exhibitionId

    const searchExhibitionReviews = await ExhibitionReviews.findAll({
      include: [
        {
          model: ExhibitionHashtag,
          attributes: ["tagName"],
          required: false,
          where: {
            isUse: "Y",
          },
        },
        {
          model: Users,
          attributes: ["userEmail"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileId", "profileNickname", "profileImg"],
            },
          ],
        },
      ],
      where: { [Op.and]: [{ reviewStatus: { [Op.ne]: ["RS04"] } }, { exhibitionId }] },
      order: [["createdAt", "DESC"]],
      limit, 
      offset
    });

    const exhibitionReviewCnt = await ExhibitionReviews.count({
      where: { [Op.and]: [{ reviewStatus: { [Op.ne]: ["RS04"] } }, { exhibitionId }] },
    });

    const hasNextPage = offset + limit < exhibitionReviewCnt;

    const paginationInfo = {
      limit,
      offset,
      exhibitionReviewCnt,
      hasNextPage,
    };

    return {searchExhibitionReviews, paginationInfo};
  };

  /**
   * 리뷰 한건 조회
   * @param {string} exhibitionReviewId
   * @returns 리뷰 레코드
   */
  searchExhibitionReview = async (exhibitionReviewId) => {
    // 입력 받을 데이터
    // exhibitionId

    const searchExhibitionReview = await ExhibitionReviews.findOne({
      where: { exhibitionReviewId },
      attributes: ["exhibitionId"]
    });

    return searchExhibitionReview;
  };

  /**
   * 특정 유저가 쓴 리뷰 조회
   * @param {string} userEmail
   * @param {number} limit
   * @param {number} offset
   * @returns {searchReviewsByUser, paginationInfo} 검색된 리뷰 레코드 배열
   */
  searchReviewsByUser = async (userEmail, limit, offset) => {
    // 입력 받을 데이터
    // userEmail

    const searchReviewsByUser = await ExhibitionReviews.findAll({
      include: [
        {
          model: ExhibitionHashtag,
          attributes: ["tagName"],
          where: {
            isUse: "Y",
          },
          required: false,
        },
        {
          model: Users,
          attributes: ["userEmail"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileId", "profileNickname", "profileImg"],
            },
          ],
        },
      ],
      where: { [Op.and]: [{ reviewStatus: { [Op.ne]: ["RS04"] } }, { userEmail }] },
      order: [["createdAt", "DESC"]],
      limit, 
      offset
    });

    const exhibitionReviewCnt = await ExhibitionReviews.count({
      where: { reviewStatus: { [Op.ne]: ["RS04"] } },
    });

    const hasNextPage = offset + limit < exhibitionReviewCnt;

    const paginationInfo = {
      limit,
      offset,
      exhibitionReviewCnt,
      hasNextPage,
    };

    return {searchReviewsByUser, paginationInfo};
  };
}

module.exports = ExhibitionReviewRepository;
