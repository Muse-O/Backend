const ExhibitionReviewService = require("../services/exhibitionReview.service");
const pkIdParamSchema = require("../schemas/pkIdParamSchema");
const pageQuerySchema = require("../schemas/pageQuerySchema");
const exhibitionReviewSchema = require("../schemas/exhibitionReviewSchema");
const Boom = require("boom");

class ExhibitionController {
  constructor() {
    this.exhibitionReviewService = new ExhibitionReviewService();
  }

  /**
   * 리뷰 목록 조회
   */
  searchExhibitionReviews = async (req, res, next) => {
    try {
      const { exhibitionId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const { limit = 10, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const exhibitionReviewList = await this.exhibitionReviewService.searchExhibitionReviews(
        exhibitionId,
        Number(limit),
        Number(offset)
      );

      if(!exhibitionReviewList.searchExhibitionReviews){
        return res.status(200).json({
          message: "해당 전시에 리뷰가 존재하지 않습니다.",
        });
      }

      return res.status(200).json({
        exhibitionReviewList,
        message: "해당 전시의 리뷰 정보를 가져왔습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 특정 유저가 작성한 리뷰 조회
   */
  searchReviewsByUser = async (req, res, next) => {
    try {
      const { userEmail } = req.body;

      const { limit = 10, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const searchReviewsByUser = await this.exhibitionReviewService.searchReviewsByUser(
        userEmail,
        Number(limit),
        Number(offset)
      );

      if(!searchReviewsByUser.searchReviewsByUser){
        return res.status(200).json({
          message: "해당 유저의 리뷰가 존재하지 않습니다.",
        });
      }

      return res.status(200).json({
        searchReviewsByUser,
        message: "해당 유저의 리뷰 정보를 가져왔습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 리뷰 등록
   */
  insertExhibitionReview = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const { exhibitionId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const validatedData = await exhibitionReviewSchema
        .validateAsync(req.body)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const insertExhibitionReview = await this.exhibitionReviewService.insertExhibitionReview(
        exhibitionId,
        userEmail,
        validatedData
      );

      if(insertExhibitionReview){
        return res.status(201).json({
          message: "해당 전시에 리뷰를 작성했습니다.",
        });
      }

      throw Boom.badRequest(
        "리뷰 작성에 실패했습니다. 전시 게시글이 삭제되었거나, 권한이 존재하지 않습니다."
      );

    } catch (error) {
      next(error);
    }
  };

  /**
   * 리뷰 수정
   */
  updateExhibitionReview = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const { exhibitionReviewId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const validatedData = await exhibitionReviewSchema
        .validateAsync(req.body)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const updateExhibitionReview = await this.exhibitionReviewService.updateExhibitionReview(
        exhibitionReviewId,
        userEmail,
        validatedData
      );

      if(updateExhibitionReview){
        return res.status(200).json({
          message: "해당 전시의 리뷰를 수정했습니다.",
        });
      }

      throw Boom.badRequest(
        "리뷰 수정에 실패했습니다. 권한이 없거나 잘못된 접근입니다."
      );

    } catch (error) {
      next(error);
    }
  };

  /**
   * 리뷰 삭제
   */
  deleteExhibitionReview = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const { exhibitionReviewId } = await pkIdParamSchema
        .validateAsync(req.params)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const deleteExhibitionReview = await this.exhibitionReviewService.deleteExhibitionReview(
        exhibitionReviewId,
        userEmail
      );

      if(deleteExhibitionReview){
        return res.status(200).json({
          message: "해당 전시의 리뷰를 삭제했습니다.",
        });
      }

      throw Boom.badRequest(
        "리뷰 삭제에 실패했습니다. 권한이 없거나 잘못된 접근입니다."
      );

    } catch (error) {
      next(error);
    }
  };

}

module.exports = ExhibitionController;
