const ArtgramService = require("../services/artgram.service");

class ArtgramController {
  constructor() {
    this.artgramService = new ArtgramService();
  }

  allArtgrams = async (req, res, next) => {
    // try {
    const artgrams = await this.artgramService.allArtgrams();
    res.status(200).json({ allArtgram: artgrams });
    // } catch (error) {
    //   next(error);
  };

  postArtgram = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { imgUrl, artgramTitle, artgramDesc } = req.body;
      const createArtgram = await this.artgramService.postArtgram(
        userEmail,
        imgUrl,
        artgramTitle,
        artgramDesc
      );
      res
        .status(200)
        .json({ createArtgram, message: "아트그램이 생성되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  modifyArtgram = async (req, res, next) => {
    //   try {
    const { artgramId } = req.params;
    const { artgram_title, artgram_desc } = req.body;
    const cngArtgram = await this.artgramService.modifyArtgram(
      artgramId,
      artgram_title,
      artgram_desc
    );
    res.status(200).json({ message: "아트그램이 수정되었습니다." });
    //   } catch (error) {}
  };

  removeArtgram = async (req, res, next) => {
    //   try {
    const { artgramId } = req.params;
    const deleteArtgram = await this.artgramService.removeArtgram(artgramId);
    res.status(200).json({ message: "아트그램이 삭제되었습니다." });
    //   } catch (error) {}
  };

  //     likeArtgram = async (req, res ,next) => {
  //         try{
  // const createArtgram = await this.artgramService.postArtgram();
  //         }catch(error){

  //         }
  //     }

  //     commentCreate = async (req, res ,next) => {
  //         try{
  // const createArtgram = await this.artgramService.postArtgram();
  //         }catch(error){

  //         }
  //     }

  //     allComment = async (req, res ,next) => {
  //         try{
  // const createArtgram = await this.artgramService.postArtgram();
  //         }catch(error){

  //         }
  //     }

  //     modifyComment = async (req, res ,next) => {
  //         try{
  // const createArtgram = await this.artgramService.postArtgram();
  //         }catch(error){

  //         }
  //     }

  //     removeComment = async (req, res ,next) => {
  //         try{
  // const createArtgram = await this.artgramService.postArtgram();
  //         }catch(error){

  //         }
  //     }

  //     postArtgram = async (req, res ,next) => {
  //         try{
  // const createArtgram = await this.artgramService.postArtgram();
  //         }catch(error){

  //         }
  //     }
  // };
}

module.exports = ArtgramController;
