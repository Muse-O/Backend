
const Boom = require("boom");
const CommonAPIRepository = require("../repositories/commonAPI.repository");

class CoomonAPIService {
  constructor() {
    this.commonAPIRepository = new CommonAPIRepository();
  }
  
  /**
   * 카테고리 검색 - 공통코드 대분류 검색
   * @param {array[<string>]} category 
   * @returns 카테고리별 배열 
   */
  getCategory = async (category) => {

    const category = await this.commonAPIRepository.findCategory(category);

    if(!category) {
      throw Boom.notFound("검색된 카테고리가 존재하지 않습니다.");
    }

    return category;
  };

}
module.exports = CoomonAPIService;
