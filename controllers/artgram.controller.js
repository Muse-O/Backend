const ArtgramService = require("../services/artgram.service");
const artgramSchema = require("../schemas/artgramReqSchema");
const Boom = require("boom");

class ArtgramController {
  constructor() {
    this.artgramService = new ArtgramService();
  }

  /**
   * 아트그램 전체조회
   */
  allArtgrams = async (req, res, next) => {
    try {
      const limit = Number(req.query.limit);
      const offset = Number(req.query.offset);

      console.log("limit=", limit, "offset=", offset);
      const artgrams = await this.artgramService.allArtgrams(limit, offset);
      res
        .status(200)
        .json({ ...artgrams, message: "아트그램을 정상적으로 가져왔습니다." });
    } catch (error) {
      next(error);
    }
  };
  /**
   * 아트그램 작성
   */
  postArtgram = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const validatedData = await artgramSchema
        .validateAsync(req.body)
        .catch((err) => {
          res.status(402).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });
      const createArtgram = await this.artgramService.postArtgram(
        userEmail,
        validatedData
      );
      res.status(200).json({
        artgram: createArtgram,
        message: "아트그램이 생성되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * 아트그램 수정
   */
  modifyArtgram = async (req, res, next) => {
    try {
      const { artgramId } = req.params;
      const validatedData = await artgramSchema
        .validateAsync(req.body)
        .catch((err) => {
          res.status(402).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });
      const cngArtgram = await this.artgramService.modifyArtgram(
        artgramId,
        validatedData
      );
      res.status(200).json({ message: "아트그램이 수정되었습니다." });
    } catch (error) {
      next(error);
    }
  };
  /**
   * 아트그램 삭제
   */
  removeArtgram = async (req, res, next) => {
    try {
      const { artgramId } = req.params;
      const deleteArtgram = await this.artgramService.removeArtgram(artgramId);
      res.status(200).json({ message: "아트그램이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 아트그램 좋아요등록/취소
   */
  likeArtgram = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { artgramId } = req.params;
      const likeartgram = await this.artgramService.likeArtgram(
        artgramId,
        userEmail
      );
      if (likeartgram === "create") {
        res.status(200).json({ message: "좋아요가 등록되었습니다." });
      } else {
        res.status(200).json({ message: "좋아요가 취소되었습니다." });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * 아트그램 스크랩등록/취소
   */
  scrapArtgram = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { artgramId } = req.params;

      const scrapartgram = await this.artgramService.scrapArtgram(
        artgramId,
        userEmail
      );
      if (scrapartgram === "create") {
        res.status(200).json({ message: "아트그램을 스크랩했습니다." });
      } else {
        res.status(200).json({ message: "스크랩을 취소했습니다." });
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ArtgramController;
