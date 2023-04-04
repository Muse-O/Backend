
const CommonAPIService = require("../services/commonAPI.service");

class CommonAPIController {
  constructor() {
    this.commonAPIService = new CommonAPIService();
  }

  /**
   * 카테고리 아이템 검색
   */
  getCategory = async (req, res, next) => {
    try {
      const { category } = req.query;
      const searchItem = category.split(",");

      const searchCategory = await this.commonAPIService.getCategory(searchItem);

      return res.status(200).json({ searchCategory, message: "카테고리 정보를 성공적으로 가져왔습니다." });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
}

module.exports = CommonAPIController;