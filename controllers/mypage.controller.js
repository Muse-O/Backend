const MypageService = require("../services/mypage.service");
const logger = require("../middlewares/logger.js");
const Boom = require("boom");
const mypageSchema = require("../schemas/mypageReqSchema");
const pageQuerySchema = require("../schemas/pageQuerySchema");

class MypageController {
  mypageService = new MypageService();
  
  /**
   * 내 프로필 조회
   */
  getMyProfile = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const result = await this.mypageService.getMyProfile(userEmail);

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 내 프로필 수정
   */
  updateMyProfile = async (req, res, next) => {
    try {
      const { profileImg, nickname, introduction } = req.body;
      const { userEmail } = res.locals.user;
      const validate = mypageSchema.validate(req.body);

      if (validate.error) {
        throw Boom.badRequest(validate.error.message);
      } else {
        console.log("Valid input!");
      }

      const updatedProfile = await this.mypageService.updateMyProfile(
        profileImg,
        nickname,
        introduction,
        userEmail
      );
      const result = {
        profileImg: updatedProfile.profileImg,
        nickname: updatedProfile.profileNickname,
        introduction: updatedProfile.profileIntro,
      };
      return res
        .status(200)
        .json({ message: "프로필 수정 성공했습니다.", result });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 내가 작성한 전시회 조회
   */
  getMyExhibition = async (req, res, next) => {
    try {
      const { limit = 4, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const { userEmail } = res.locals.user;

      const exhibitions = await this.mypageService.getMyExhibition(
        Number(limit),
        Number(offset),
        userEmail
      );

      return res.status(200).json(exhibitions);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 내가 좋아요한 전시회 조회
   */
  getMyLikedExhibition = async (req, res, next) => {
    try {
      const { limit = 4, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const { userEmail } = res.locals.user;

      const result = await this.mypageService.getMyLikedExhibition(
        Number(limit),
        Number(offset),
        userEmail
      );

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 내가 스크랩한 전시회 조회
   */
  getMyScrappedExhibition = async (req, res, next) => {
    try {
      const { limit = 4, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const { userEmail } = res.locals.user;

      const result = await this.mypageService.getMyScrappedExhibition(
        Number(limit),
        Number(offset),
        userEmail
      );

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 내가 작성한 아트그램 조회
   */
  getMyArtgram = async (req, res, next) => {
    try {
      const { limit = 4, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const { userEmail } = res.locals.user;
      const artgrams = await this.mypageService.getMyArtgram(
        Number(limit),
        Number(offset),
        userEmail
      );

      return res.status(200).json(artgrams);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 내가 좋아요한 아트그램 조회
   */
  getMyLikedArtgram = async (req, res, next) => {
    try {
      const { limit = 4, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const { userEmail } = res.locals.user;
      const result = await this.mypageService.getMyLikedArtgram(
        Number(limit),
        Number(offset),
        userEmail
      );

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 내가 스크랩한 아트그램 조회
   */
  getMyScrappedArtgram = async (req, res, next) => {
    try {
      const { limit = 4, offset = 0 } = await pageQuerySchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const { userEmail } = res.locals.user;
      const result = await this.mypageService.getMyScrappedArtgram(
        Number(limit),
        Number(offset),
        userEmail
      );

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
}

module.exports = MypageController;
