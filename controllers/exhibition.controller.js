const ExhibitionService = require("../services/exhibition.service");
const exhibitionSchema = require("../schemas/exhibitionReqSchema");

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
        Number(limit),
        Number(offset)
      );

      return res.status(200).json({
        ...exhibitionItem,
        message: "전시회 정보를 정상적으로 가져왔습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 전시회 상세 조회
   */
  getExhibitionDetail = async (req, res, next) => {
    try {
      const { exhibitionId } = req.params;

      const exhibitionInfo = await this.exhibitionService.getExhibitionInfo(
        exhibitionId
      );

      return res
        .status(200)
        .json({ exhibitionInfo, message: "게시글을 조회했습니다." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 전시회 등록
   */
  writeExhibition = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const validatedData = await exhibitionSchema
        .validateAsync(req.body)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const writeExhibitionInfo = await this.exhibitionService.updateExhibition(
        "C",
        userEmail,
        validatedData
      );

      return res.status(201).json({
        writeExhibitionInfo,
        message: "전시회 게시글을 작성했습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 전시회 수정
   */
  updateExhibition = async (req, res, next) => {
    try {
      const { exhibitionId } = req.params;
      const { userEmail } = res.locals.user;
      const validatedData = await exhibitionSchema
        .validateAsync(req.body)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });
      validatedData.exhibitionId = exhibitionId;

      const updateExhibitionInfo =
        await this.exhibitionService.updateExhibition(
          "U",
          userEmail,
          validatedData
        );

      return res.status(200).json({
        message: "전시회 게시글을 수정했습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 전시회 삭제
   */
  deleteExhibition = async (req, res, next) => {
    try {
      const { exhibitionId } = req.params;
      const { userEmail } = res.locals.user;

      const deleteExhibitionInfo =
        await this.exhibitionService.deleteExhibition(
          userEmail,
          exhibitionId
        );

      return res.status(200).json({
        message: "전시회 게시글을 삭제했습니다.",
      })
    } catch (error) {
      next(error);
    }
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
