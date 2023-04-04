const { Exhibitions } = require("../models");
const { Op } = require("sequelize");

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
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    })

    const exhibitionCnt = await Exhibitions.count();

    const hasNextPage = offset + limit < exhibitionCnt;
    
    const paginationInfo = {
      limit,
      offset,
      exhibitionCnt,
      hasNextPage,
    }

    return {exhibitionList, paginationInfo};
  }

}

module.exports = CommonAPIRepository;