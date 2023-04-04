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
   * @returns exhibitionItem
   */
  getExhibitionList = async (limit, offset) => {
    const exhibitionItem = await this.exhibitionRepository.getExhibitionList(limit, offset);

    if (!exhibitionItem.exhibitionList) {
      throw Boom.notFound("전시회 정보가 더 이상 없습니다.");
    }

    return exhibitionItem;
  };

  getExhibitionDetail = async (mode) => {
    
  };

  writeExhibition = async (mode) => {
    
  };

  updateExhibition = async (mode) => {
    
  };

  deleteExhibition = async (mode) => {
    
  };

  scrapExhibition = async (mode) => {
    
  };

  likeExhibition = async (mode) => {
    
  };

  searchExhibition = async (mode) => {
    
  };

  searchCategoryExhibition = async (mode) => {
    
  };

}
module.exports = ExhibitionService;
