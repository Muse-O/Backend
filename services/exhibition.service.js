const Boom = require("boom");
const ExhibitionRepository = require("../repositories/exhibition.repository");

class ExhibitionService {
  constructor() {
    this.exhibitionRepository = new ExhibitionRepository();
  }

  /**
   * 전시 게시글 목록 조회
   * @param {number} limit 요청할 전시 게시글 수
   * @param {number} offset 조회 전시 게시글 시작점
   * @param {string} userEmail 유저 이메일
   * @returns exhibitionItem
   */
  getExhibitionList = async (limit, offset, userEmail) => {
    const exhibitionItem = await this.exhibitionRepository.getExhibitionList(
      limit,
      offset,
      userEmail
    );

    if (!exhibitionItem) {
      throw Boom.notFound(
        "전시회 정보가 더 이상 없습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
      );
    }

    return exhibitionItem;
  };

  /**
   * 전시 게시글 상세 조회
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {string} userEmail 유저 이메일
   * @returns exhibitionInfo
   */
  getExhibitionInfo = async (exhibitionId, userEmail) => {
    const exhibitionInfo = await this.exhibitionRepository.getExhibitionInfo(
      exhibitionId,
      userEmail
    );

    if (!exhibitionInfo) {
      throw Boom.notFound(
        "해당 게시글이 존재하지 않습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
      );
    }

    return exhibitionInfo;
  };

  /**
   * 전시회 작성/수정
   * @param {string} mode 작성/수정 모드
   * @param {string} userEmail 유저 이메일
   * @param {exhibitionSchema} exhibitionReq 검증된 전시회 객체
   * @returns 작성 결과 updateInfo
   */
  updateExhibition = async (mode, userEmail, exhibitionReq) => {
    let updateInfo = {};

    const {
      artImage,
      delImage,
      exhibitionCategoty,
      authors,
      detailLocation,
      ...exhibitionObj
    } = exhibitionReq;

    // 전시회 생성
    const updateExhibitionItem =
      await this.exhibitionRepository.updateExhibition(
        mode,
        userEmail,
        exhibitionObj
      );

    if (mode === "C") {
      if (!updateExhibitionItem) {
        throw Boom.badRequest(
          "전시회 게시글 작성에 실패했습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
        );
      }
    }

    if (mode === "U") {
      if (updateExhibitionItem[0] === 0) {
        throw Boom.badRequest(
          "전시회 게시글 수정에 실패했습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
        );
      }
    }

    if (artImage.length > 0) {
      // 이미지
      const writeImageStatus =
        await this.exhibitionRepository.updateExhibitionImg(
          mode,
          updateExhibitionItem.exhibitionId,
          delImage,
          artImage
        );

      // 이미지 수정 정보
      updateInfo.imgUpdate = writeImageStatus;
    }
    if (exhibitionCategoty.length > 0) {
      // 카테고리
      const writeExhibitionCategories =
        await this.exhibitionRepository.updateExhibitionCategory(
          mode,
          updateExhibitionItem.exhibitionId,
          exhibitionCategoty
        );

      updateInfo.categoriesUpdate = writeExhibitionCategories;
    }
    if (authors.length > 0) {
      // 작가
      const writeAuthorsStatue =
        await this.exhibitionRepository.updateExhibitionAuthors(
          mode,
          updateExhibitionItem.exhibitionId,
          authors
        );

      updateInfo.authorUpdate = writeAuthorsStatue;
    }
    if (Object.keys(detailLocation).length > 0) {
      // 장소
      const writeExhibitionLocation =
        await this.exhibitionRepository.updateExhibitionLocation(
          mode,
          updateExhibitionItem.exhibitionId,
          detailLocation
        );

      updateInfo.locationUpdate = writeExhibitionLocation;
    }

    return updateInfo;
  };

  /**
   * 전시 게시글 삭제
   * @param {string} userEmail
   * @param {string} exhibitionId
   * @returns 삭제 갯수
   */
  deleteExhibition = async (userEmail, exhibitionId) => {
    const deleteExhibitionCnt =
      await this.exhibitionRepository.deleteExhibition(userEmail, exhibitionId);

    if (deleteExhibitionCnt[0] === 0) {
      throw Boom.notFound(
        "게시글 삭제에 실패했습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
      );
    }

    return deleteExhibitionCnt;
  };

  /**
   * 전시 게시글 스크랩
   * @param {string} userEmail
   * @param {string} exhibitionId
   * @returns 스크랩 등록(create) or 취소(delete)
   */
  updateExhibitionScrap = async (userEmail, exhibitionId) => {
    const updateExhibitionScrap =
      await this.exhibitionRepository.updateExhibitionScrap(
        userEmail,
        exhibitionId
      );

    if (
      !updateExhibitionScrap === "create" ||
      !updateExhibitionScrap === "delete"
    ) {
      throw Boom.notFound(
        "스크랩 등록/취소에 실패했습니다. 해당 게시글이 존재하지 않거나 요청에 실패했습니다."
      );
    }

    return updateExhibitionScrap;
  };

  /**
   * 전시 게시글 좋아요
   * @param {string} userEmail
   * @param {string} exhibitionId
   * @returns 스크랩 좋아요(create) or 취소(delete)
   */
  updateExhibitionLike = async (userEmail, exhibitionId) => {
    const updateExhibitionLike =
      await this.exhibitionRepository.updateExhibitionLike(
        userEmail,
        exhibitionId
      );

    if (
      !updateExhibitionLike === "create" ||
      !updateExhibitionLike === "delete"
    ) {
      throw Boom.notFound(
        "좋아요 등록/취소에 실패했습니다. 해당 게시글이 존재하지 않거나 요청에 실패했습니다."
      );
    }

    return updateExhibitionLike;
  };

  /**
   * 전시 게시글 카테고리별 검색
   * @param {array[string]} categories
   * @param {string} userEmail 유저 이메일
   * @returns 검색된 게시글 리스트
   */
  searchCategoryExhibition = async (categories, userEmail) => {
    const searchExhibition =
      await this.exhibitionRepository.searchCategoryExhibition(
        categories,
        userEmail
      );

    if (!searchExhibition.length > 0) {
      throw Boom.notFound("해당 카테고리의 전시회가 없습니다.");
    }

    return searchExhibition;
  };
}
module.exports = ExhibitionService;
