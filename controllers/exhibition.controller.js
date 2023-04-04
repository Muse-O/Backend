const ExhibitionService = require("../services/exhibition.service");

class ExhibitionController {
  constructor() {
    this.exhibitionService = new ExhibitionService();
  }

  /**
   * 전시회 목록 조회
   */
  getExhibitionList = async (req, res, next) => {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const exhibitionItem = await this.exhibitionService.getExhibitionList(
        limit,
        offset
      );

      return res
        .status(200)
        .json({
          ...exhibitionItem,
          message: "전시회 정보를 정상적으로 가져왔습니다.",
        });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 전시회 상세 조회
   */
  getExhibitionDetail = async (req, res, next) => {
    try {
      const { exhibitionId } = req.param;

      const exhibitionInfo = await this.exhibitionService.getExhibitionDetail(exhibitionId);

      return res.status(200).json({ exhibitionInfo, message: "로그인에 성공했습니다" });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 전시회 등록
   */
  writeExhibition = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   return res.status(201).json({ message: "로그인에 성공했습니다" });
    // } catch (error) {
    //   logger.error(error.message);
    //   next(error);
    // }
  };

  /**
   * 전시회 수정
   */
  updateExhibition = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   return res.status(201).json({ message: "로그인에 성공했습니다" });
    // } catch (error) {
    //   logger.error(error.message);
    //   next(error);
    // }
  };

  /**
   * 전시회 삭제
   */
  deleteExhibition = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   return res.status(201).json({ message: "로그인에 성공했습니다" });
    // } catch (error) {
    //   logger.error(error.message);
    //   next(error);
    // }
  };

  /**
   * 전시회 스크랩
   */
  scrapExhibition = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   return res.status(201).json({ message: "로그인에 성공했습니다" });
    // } catch (error) {
    //   logger.error(error.message);
    //   next(error);
    // }
  };

  /**
   * 전시회 좋아요
   */
  likeExhibition = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   return res.status(201).json({ message: "로그인에 성공했습니다" });
    // } catch (error) {
    //   logger.error(error.message);
    //   next(error);
    // }
  };

  /**
   * 전시회 검색
   */
  searchExhibition = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   return res.status(201).json({ message: "로그인에 성공했습니다" });
    // } catch (error) {
    //   logger.error(error.message);
    //   next(error);
    // }
  };

  /**
   * 전시회 카테고리 검색
   */
  searchCategoryExhibition = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   return res.status(201).json({ message: "로그인에 성공했습니다" });
    // } catch (error) {
    //   logger.error(error.message);
    //   next(error);
    // }
  };
}

module.exports = ExhibitionController;
