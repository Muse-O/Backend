
const CommonAPIService = require("../services/commonAPI.service");
const codeSearchSchema = require("../schemas/codeSearchSchema");
const Boom = require("boom")
class CommonAPIController {
  constructor() {
    this.commonAPIService = new CommonAPIService();
  }

  /**
   * 카테고리 아이템 검색
   */
  getCategory = async (req, res, next) => {
    try {
      const { category } = await codeSearchSchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const searchItem = category.split(",");

      const searchCategory = await this.commonAPIService.getCategory(searchItem);

      return res.status(200).json({ searchCategory, message: "카테고리 정보를 성공적으로 가져왔습니다." });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CommonAPIController;