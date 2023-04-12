const BannerService = require("../services/banner.service");
const Joi = require("joi");

const reqQuerySchema = Joi.object({
  reqCnt: Joi.string().messages({
    "any.required": "요청할 게시글 갯수(reqCnt)를 입력해주세요.",
    "number.empty":
      "요청할 게시글 갯수(reqCnt)를 문자열 타입으로 입력해주세요.",
  }),
});

class BannerController {
  constructor() {
    this.bannerService = new BannerService();
  }

  /**
   * 현재 날짜에(한국 시간) 전시중인 전시회 중 좋아요 순 전시글
   */
  getOpenExhibitionsSortedByMostLike = async (req, res, next) => {
    try {
      const { reqCnt = 6 } = await reqQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const exhibitionList =
        await this.bannerService.getOpenExhibitionsSortedByMostLike(
          Number(reqCnt)
        );

      return res
        .status(200)
        .json({
          exhibitionList,
          message: "전시회 게시글 정보를 성공적으로 조회했습니다.",
        });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 현재 날짜에(한국 시간) 전시중인 전시회 중 작성일 최근순 전시글
   */
  getOpenExhibitionsSortedByDate = async (req, res, next) => {
    try {
      const { reqCnt = 10} = await reqQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const exhibitionList =
        await this.bannerService.getOpenExhibitionsSortedByDate(Number(reqCnt));

      return res
        .status(200)
        .json({
          exhibitionList,
          message: "전시회 게시글 정보를 성공적으로 조회했습니다.",
        });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 예정 전시회 중 가장 가까운 날짜 전시 중 좋아요 순
   */
  getFutureExhibitionsSortedByNearest = async (req, res, next) => {
    try {
      const { reqCnt = 10 } = await reqQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const exhibitionList =
        await this.bannerService.getFutureExhibitionsSortedByNearest(
          Number(reqCnt)
        );

      return res
        .status(200)
        .json({
          exhibitionList,
          message: "전시회 게시글 정보를 성공적으로 조회했습니다.",
        });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 최근 작성된 아트그램
   */
  getLatestArtgrams = async (req, res, next) => {
    try {
      const { reqCnt = 10 } = await reqQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const exhibitionList = await this.bannerService.getLatestArtgrams(
        Number(reqCnt)
      );

      return res
        .status(200)
        .json({
          exhibitionList,
          message: "아트그램 게시글 정보를 성공적으로 조회했습니다.",
        });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = BannerController;
