const Boom = require("boom");
const ExhibitionReviewRepository = require("../repositories/exhibitionReview.repository");
const NotiRepository = require("../repositories/notification.repository")

const { isNotNull } = require("../modules/isNotNull");
const { ExhibitionReviews, ExhibitionHashtag } = require("../models");

class ExhibitionService {
  constructor() {
    this.exhibitionReviewRepository = new ExhibitionReviewRepository();
    this.notiRepository = new NotiRepository();
  }

  /**
   * 리뷰 등록
   * @param {string} exhibitionId
   * @param {string} userEmail
   * @param {object} reviewObj 리뷰 입력 정보
   * @returns true 작성 성공 여부
   */
  insertExhibitionReview = async (exhibitionId, userEmail, reviewObj) => {
    // 분해
    const tagItem = reviewObj.hashTag ?? [];

    const reviewItem = {};

    if (isNotNull(reviewObj.reviewComment)) {
      reviewItem.reviewComment = reviewObj.reviewComment.trim();
    }

    if (isNotNull(reviewObj.reviewRating)) {
      reviewItem.reviewRating = reviewObj.reviewRating;
    }

    if (!isNotNull(reviewItem)) {
      throw Boom.badRequest("서버로부터 값이 전달되지 않았습니다.");
    }

    // 리뷰 등록
    const insertExhibitionReview =
      await this.exhibitionReviewRepository.insertExhibitionReview(
        exhibitionId,
        userEmail,
        reviewItem
      );

    // 반환된 insertExhibitionReview가 생성됐는지 검증
    if (!insertExhibitionReview instanceof ExhibitionReviews) {
      throw Boom.badRequest(
        "리뷰 작성에 실패했습니다. 전시 게시글이 삭제되었거나, 권한이 존재하지 않습니다."
      );
    }

    if (tagItem.length === 0) {
      return insertExhibitionReview;
    }

    const hashTags = tagItem.map((tag) => ({
      exhibitionId,
      exhibitionReviewId: insertExhibitionReview.exhibitionReviewId,
      userEmail,
      tagName: tag,
    }));

    // 해시태그 등록
    const insertExhibitionHashTag =
      await this.exhibitionReviewRepository.insertExhibitionHashTag(hashTags);

    if (!insertExhibitionHashTag.length === 0) {
      throw Boom.badRequest(
        "리뷰 작성에 실패했습니다. 전시 게시글이 삭제되었거나, 권한이 존재하지 않습니다."
      );
    }

    const noti_receiver = await this.exhibitionReviewRepository.findreviewNotiReceiver(exhibitionId);
    const noti_sender = await this.notiRepository.findNotiSenderProfile(userEmail);
    if (noti_receiver == userEmail){
      return true
    }
    const notiData = {
        noti_sender : userEmail,
        noti_sender_nickname: noti_sender.profile_nickname,
        noti_type: 'comment',
        noti_content: 'exhibition',
        noti_content_id: exhibitionId
      };
    await this.notiRepository.saveToStream(noti_receiver, notiData)

    return true;
  };

  /**
   * 리뷰 수정
   * @param {string} exhibitionReviewId
   * @param {string} userEmail
   * @param {object} reviewObj 리뷰 입력 정보
   * @returns true 수정 성공 여부
   */
  updateExhibitionReview = async (exhibitionReviewId, userEmail, reviewObj) => {
    // 리뷰 등록
    // 해쉬태그 등록

    // 분해
    const tagItem = reviewObj.hashTag ?? [];

    const reviewItem = {};

    if (isNotNull(reviewObj.reviewComment)) {
      reviewItem.reviewComment = reviewObj.reviewComment.trim();
    }

    if (isNotNull(reviewObj.reviewRating)) {
      reviewItem.reviewRating = reviewObj.reviewRating;
    }

    if (!isNotNull(reviewItem)) {
      throw Boom.badRequest("서버로부터 값이 전달되지 않았습니다.");
    }

    // 리뷰 수정
    const updateExhibitionReview =
      await this.exhibitionReviewRepository.putExhibitionReview(
        exhibitionReviewId,
        userEmail,
        reviewItem
      );

    if (!updateExhibitionReview > 0) {
      throw Boom.badRequest(
        "리뷰 수정에 실패했습니다. 권한이 없거나 잘못된 접근입니다."
      );
    }

    // 태그 삭제
    if (tagItem.length > 0) {
      await this.exhibitionReviewRepository.deleteExhibitionHashTag(
        exhibitionReviewId,
        userEmail
      );
    } else {
      return true;
    }

    const searchExhibitionReview =
      await this.exhibitionReviewRepository.searchExhibitionReview(
        exhibitionReviewId
      );

    const hashTags = tagItem.map((tag) => ({
      exhibitionId: searchExhibitionReview.exhibitionId,
      exhibitionReviewId,
      userEmail,
      tagName: tag,
    }));

    // 태그 추가
    const insertExhibitionHashTag =
      await this.exhibitionReviewRepository.insertExhibitionHashTag(hashTags);

    if (!insertExhibitionHashTag.length === 0) {
      throw Boom.badRequest(
        "리뷰 수정에 실패했습니다. 권한이 없거나 잘못된 접근입니다."
      );
    }

    return true;
  };

  /**
   * 리뷰 삭제
   * @param {string} exhibitionReviewId
   * @param {string} userEmail
   * @returns true 삭제 성공 여부
   */
  deleteExhibitionReview = async (exhibitionReviewId, userEmail) => {
    const deleteExhibitionReview =
      await this.exhibitionReviewRepository.deleteExhibitionReview(
        exhibitionReviewId,
        userEmail
      );

    if (!deleteExhibitionReview > 0) {
      throw Boom.badRequest(
        "리뷰 삭제에 실패했습니다. 해당 리뷰가 존재하지 않거나 권한이 없습니다."
      );
    }

    const deleteExhibitionHashTag =
      await this.exhibitionReviewRepository.deleteExhibitionHashTag(
        exhibitionReviewId,
        userEmail
      );

    if (!deleteExhibitionHashTag > 0) {
      throw Boom.badRequest(
        "리뷰 삭제에 실패했습니다. 해당 리뷰가 존재하지 않거나 권한이 없습니다."
      );
    }

    return true;
  };

  /**
   * 리뷰 조회
   * @param {string} exhibitionId
   * @param {number} limit
   * @param {number} offset
   * @returns false 조회된 리뷰 없음. / searchExhibitionReviews 검색된 리뷰 레코드 배열
   */
  searchExhibitionReviews = async (exhibitionId, limit, offset) => {
    const searchExhibitionReviews =
      await this.exhibitionReviewRepository.searchExhibitionReviews(
        exhibitionId,
        limit,
        offset
      );

    if (searchExhibitionReviews.searchExhibitionReviews.length === 0) {
      return false;
    }

    return searchExhibitionReviews;
  };

  /**
   * 특정 유저가 작성한 리뷰 조회
   * @param {string} userEmail
   * @param {number} limit
   * @param {number} offset
   * @returns false 조회된 리뷰 없음. / searchReviewsByUser 검색된 리뷰 레코드 배열
   */
  searchReviewsByUser = async (userEmail, limit, offset) => {
    const searchReviewsByUser =
      await this.exhibitionReviewRepository.searchReviewsByUser(
        userEmail,
        limit,
        offset
      );

    if (searchReviewsByUser.searchReviewsByUser.length === 0) {
      return false;
    }

    return searchReviewsByUser;
  };
}
module.exports = ExhibitionService;
