const ExhibitionService = require("../services/exhibition.service");
const exhibitionSchema = require("../schemas/exhibitionReqSchema");
const categorySchema = require("../schemas/categoryQuerySchema");
const pkIdParamSchema = require("../schemas/pkIdParamSchema");
const pageQuerySchema = require("../schemas/pageQuerySchema");
const Boom = require("boom");

class ExhibitionController {
  constructor() {
    this.exhibitionService = new ExhibitionService();
  }

  /**
   * 전시회 목록 조회
   */
  getExhibitionList = async (req, res, next) => {
    try {
      const { userEmail = ""} = res.locals.user;
      
      const { limit = 10, offset = 0, ...filter } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const exhibitionItem = await this.exhibitionService.getExhibitionList(
        Number(limit),
        Number(offset),
        userEmail,
        filter
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
      const { userEmail = ""} = res.locals.user;

      const { exhibitionId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const exhibitionInfo = await this.exhibitionService.getExhibitionInfo(
        exhibitionId,
        userEmail
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
      // 오프라인의 경우 오픈시간, 종료시간 입력
      if(validatedData.exhibitionKind === 'EK0001'){
        if(!validatedData.openTime && !validatedData.closeTime){
          throw Boom.badRequest("오픈 시간(openTime)/종료 시간(closeTime)을 입력해주세요.");
        }
      }

      if(validatedData.startDate > validatedData.endDate){
        throw Boom.badRequest("운영 날짜를 확인해 주세요. 종료일은 시작일보다 뒤 날짜이어야 합니다.");
      }

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
      const { userEmail } = res.locals.user;

      const { exhibitionId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

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
      const { userEmail } = res.locals.user;

      const { exhibitionId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const deleteExhibitionInfo =
        await this.exhibitionService.deleteExhibition(userEmail, exhibitionId);

      return res.status(200).json({
        message: "전시회 게시글을 삭제했습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 전시회 스크랩
   */
  scrapExhibition = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const { exhibitionId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const updateExhibitionScrap =
        await this.exhibitionService.updateExhibitionScrap(
          userEmail,
          exhibitionId
        );

      if (updateExhibitionScrap == "create") {
        return res
          .status(201)
          .json({ message: "해당 전시글을 스크랩 했습니다." });
      } else if (updateExhibitionScrap == "delete") {
        return res
          .status(201)
          .json({ message: "해당 전시글을 스크랩에서 제외했습니다." });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * 전시회 좋아요
   */
  likeExhibition = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const { exhibitionId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const updateExhibitionLike =
        await this.exhibitionService.updateExhibitionLike(
          userEmail,
          exhibitionId
        );

      if (updateExhibitionLike == "create") {
        return res
          .status(201)
          .json({ message: "해당 전시글에 좋아요를 눌렀습니다." });
      } else if (updateExhibitionLike == "delete") {
        return res
          .status(201)
          .json({ message: "해당 전시글에 좋아요를 취소 했습니다." });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * 카테고리별 전시회 검색
   */
  searchCategoryExhibition = async (req, res, next) => {
    try {
      const { userEmail = ""} = res.locals.user;
      const { ...item } = await categorySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const searchExhibition =
        await this.exhibitionService.searchCategoryExhibition(
          Object.values(item),
          userEmail
        );

      return res
        .status(200)
        .json({
          searchExhibition,
          message: "전시회 정보를 정상적으로 가져왔습니다.",
        });
    } catch (error) {
      next(error);
    }
  };

  /**
   * TOP 10 태그 조회
   */
  getTopTags = async (req, res, next) => {
    try {
      const topTags = await this.exhibitionService.getTopTags();

      return res
        .status(200)
        .json({
          topTags,
          message: "전시 TOP 10 태그를 정상적으로 가져왔습니다.",
        });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ExhibitionController;
