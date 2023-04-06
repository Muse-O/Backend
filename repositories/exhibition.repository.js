const { Exhibitions, ExhibitionImg, ExhibitionCategory, ExhibitionAuthor, ExhibitionAddress} = require("../models");
const { Op } = require("sequelize");
const Boom = require("boom")

class ExhibitionRepository extends Exhibitions {
  constructor() {
    super();
  }

  /**
   * 전시 게시글 목록 조회
   * @param {number} limit 요청할 전시 게시글 수
   * @param {number} offset 조회 전시 게시글 시작점
   * @returns exhibitionItem
   */
  getExhibitionList = async (limit, offset) => {
    const exhibitionList = await Exhibitions.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const exhibitionCnt = await Exhibitions.count();

    const hasNextPage = offset + limit < exhibitionCnt;

    const paginationInfo = {
      limit,
      offset,
      exhibitionCnt,
      hasNextPage,
    };

    return { exhibitionList, paginationInfo };
  };

  /**
   * 전시회 정보 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} userEmail 유저 이메일
   * @param {object} exhibitionObj 전시회 정보 객체
   * @returns 입력한 전시 정보
   */
  updateExhibition = async (mode, userEmail, exhibitionObj) => {
    let updateExhibition = {};

    if (mode === "C") {
      // 작성
      const { exhibitionId, ...exhibitionInfo } = exhibitionObj;
      updateExhibition = await Exhibitions.create({
        userEmail,
        ...exhibitionInfo,
      });
    } else if(mode === "U") {
      // 수정
      updateExhibition = await Exhibitions.update(
        {
          userEmail,
          ...exhibitionObj,
        },
        {
          where: { exhibitionId: exhibitionObj.exhibitionId },
        }
      );

      updateExhibition.exhibitionId = exhibitionObj.exhibitionId
    }

    return updateExhibition;
  };

  /**
   * 전시회 이미지 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {array[object]} delImage 삭제할 이미지
   * @param {array[object]} artImage 추가할 이미지
   * @returns deleteImgCnt: number, updateImgCnt: number 이미지 수정 정보
   */
  updateExhibitionImg = async (mode, exhibitionId, delImage, artImage) => {
    let updateImgStatus = {deleteImgCnt: 0, updateImgCnt: 0};
    let updateExhibitionArtImg = null;

    // order가 작은순대로 정렬
    artImage.sort((a, b) => parseInt(a.order) - parseInt(b.order));

    const rowToArtImg = artImage.map(({order, imgUrl, imgCaption}) => ({
      exhibitionId,
      imgOrder: parseInt(order),
      imgUrl,
      imgCaption
    }));

    if (mode === "C") {
      // 이미지 추가
      updateExhibitionArtImg = await ExhibitionImg.bulkCreate(rowToArtImg);

      updateImgStatus.updateImgCnt = updateExhibitionArtImg.length
    } else if (mode === "U") {
      // 기존 이미지 삭제
      const deleteCnt = await ExhibitionImg.destroy(
        {
          where: {exhibitionId}
        }
      );
      updateImgStatus.deleteImgCnt = deleteCnt;
      // 이미지 추가
      updateExhibitionArtImg = await ExhibitionImg.bulkCreate(rowToArtImg);
      updateImgStatus.updateImgCnt = updateExhibitionArtImg.length
    } else {
      updateImgStatus.updateImgCnt = 0
    }
    return updateImgStatus;
  };

  /**
   * 전시회 카테고리 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {array[string]} categories 추가할 카테고리
   * @returns deleteCategoriesCnt: number, updateCategoriesCnt: number 카테고리 수정 정보
   */
  updateExhibitionCategory = async (mode, exhibitionId, categories) => {
    let updateCategoryStatus = {deleteCategoriesCnt: 0, updateCategoriesCnt: 0};
    let updateExhibitionCategories = null;

    const rowToCategories = categories.map(categoryCode => ({
      exhibitionId,
      categoryCode
    }));

    if (mode === "C") {
      // 카테고리 추가
      updateExhibitionCategories = await ExhibitionCategory.bulkCreate(rowToCategories);

      updateCategoryStatus.updateCategoriesCnt = updateExhibitionCategories.length;
    } else if (mode === "U") {
      // 기존 카테고리 삭제
      const deleteCategoriesCnt = await ExhibitionCategory.destroy(
        {
          where: { exhibitionId }
        }
      );
      updateCategoryStatus.deleteCategoriesCnt = deleteCategoriesCnt

      console.log('\n\n',rowToCategories, '\n\n');
      // 카테고리 추가
      updateExhibitionCategories = await ExhibitionCategory.bulkCreate(rowToCategories);

      updateCategoryStatus.updateCategoriesCnt = updateExhibitionCategories.length;
    } else {
      updateCategoryStatus.updateCategoriesCnt = 0
    }
    return updateCategoryStatus;
  };

  /**
   * 전시회 작가 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {array[object]} authors 작가 정보
   * @returns deleteAuthorCnt: number, updateAuthorCnt: number 작사 수정 정보
   */
  updateExhibitionAuthors = async (mode, exhibitionId, authors) => {
    let updateAuthorStatus = {deleteAuthorCnt: 0, updateAuthorCnt: 0};
    let updateExhibitionAuthor = null;

    // order가 작은순대로 정렬
    authors.sort((a, b) => parseInt(a.order) - parseInt(b.order));

    const rowToAuthor = authors.map(({author}) => ({
      exhibitionId,
      authorName: author
    }));

    if (mode === "C") {
      // 전시회 추가
      updateExhibitionAuthor = await ExhibitionAuthor.bulkCreate(rowToAuthor);

      updateAuthorStatus.updateAuthorCnt = updateExhibitionAuthor.length;
    } else if (mode === "U") {
      // 기존 카테고리 삭제
      const deleteAuthorCnt = await ExhibitionAuthor.destroy(
        {
          where: { exhibitionId }
        }
      );
      updateAuthorStatus.deleteAuthorCnt = deleteAuthorCnt
      // 전시회 추가
      updateExhibitionAuthor = await ExhibitionAuthor.bulkCreate(rowToAuthor);

      updateAuthorStatus.updateAuthorCnt = updateExhibitionAuthor.length;
    } else {
      updateAuthorStatus.updateAuthorCnt = 0
    }
    return updateAuthorStatus;
  };

  /**
   * 전시회 장소 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {object} detailLocation 전시회 장소 정보
   * @returns deleteLocationCnt: number, updateLocationCnt: number 장소 수정 정보
   */
  updateExhibitionLocation = async (mode, exhibitionId, detailLocation) => {
    let updateLocationStatus = {deleteLocationCnt: 0, updateLocationCnt: 0};
    let updateExhibitionLocation = null;

    if (mode === "C") {
      // 장소 추가
      updateExhibitionLocation = await ExhibitionAddress.create({
        exhibitionId,
        ...detailLocation
      });

      if(updateExhibitionLocation){
        updateLocationStatus.updateLocationCnt = 1
      }
    } else if (mode === "U") {
      // 기존 장소 삭제
      const deleteLocationCnt = await ExhibitionAddress.destroy(
        {
          where: { exhibitionId }
        }
      );
      updateLocationStatus.deleteLocationCnt = deleteLocationCnt
      // 장소 추가
      updateExhibitionLocation = await ExhibitionAddress.create({
        exhibitionId,
        ...detailLocation
      });

      if(updateExhibitionLocation){
        updateLocationStatus.updateLocationCnt = 1
      }
    } else {
      updateLocationStatus.updateLocationCnt = 0
    }
    return updateLocationStatus;
  };
}

module.exports = ExhibitionRepository;
