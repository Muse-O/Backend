const ArtgramService = require("../services/artgram.service");

class ArtgramController {
  constructor() {
    this.artgramService = new ArtgramService();
  }

  //아트그램 전체조회
  allArtgrams = async (req, res, next) => {
    try {
      const artgrams = await this.artgramService.allArtgrams();
      res.status(200).json({ allArtgram: artgrams });
    } catch (error) {
      next(error);
    }
  };

  //아트그램 작성
  postArtgram = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { artgramId } = req.params;
      const { imgUrl, artgramTitle, artgramDesc } = req.body;
      const files = req.files;
      imgUrl = files;
      console.log(imgUrl);
      const createArtgram = await this.artgramService.postArtgram(
        artgramId,
        userEmail,
        imgUrl,
        artgramTitle,
        artgramDesc
      );
      res.status(200).json({
        artgram: createArtgram,
        message: "아트그램이 생성되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  //아트그램 수정
  modifyArtgram = async (req, res, next) => {
    try {
      const { artgramId } = req.params;
      const { artgramTitle, artgramDesc } = req.body;
      const cngArtgram = await this.artgramService.modifyArtgram(
        artgramId,
        artgramTitle,
        artgramDesc
      );
      res.status(200).json({ message: "아트그램이 수정되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  //아트그램 삭제
  removeArtgram = async (req, res, next) => {
    try {
      const { artgramId } = req.params;
      const deleteArtgram = await this.artgramService.removeArtgram(artgramId);
      res.status(200).json({ message: "아트그램이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  //아트그램 좋아요등록/취소
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

  //아트그램 스크랩등록/취소
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
