const { CommonCodes } = require("../models");
const { Op } = require("sequelize");

class CommonAPIRepository extends CommonCodes{
  constructor() {
    super();
  }
  
  /**
   * 카테고리 검색 - 공통코드 대분류 검색
   * @param {array<string>} category 
   * @returns searchCategory
   */
  findCategory = async (category) => {
    // 예시 WK: 작품 종류 / EK: 전시 종류
    const searchCategory = await CommonCodes.findAll({
      where: {
        codeGroupValue: {
          [Op.in]: category
        }
      }
    })

    return searchCategory;
  }

}

module.exports = CommonAPIRepository;