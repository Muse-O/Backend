const ArtgramRepository = require("../repositories/artgram.repository");
const Boom = require("boom");

class ArtgramService {
  constructor() {
    this.artgramRepository = new ArtgramRepository();
  }

  allArtgrams = async () => {
    const artgrams = await this.artgramRepository.allArtgrams();
    return artgrams;
  };

  postArtgram = async (userEmail, imgUrl, artgramTitle, artgramDesc) => {
    const postartgram = await this.artgramRepository.postArtgram(
      userEmail,
      imgUrl,
      artgramTitle,
      artgramDesc
    );
    return postartgram;
  };

  modifyArtgram = async (artgramId, artgram_title, artgram_desc) => {
    const patchartgram = await this.artgramRepository.modifyArtgram(
      artgramId,
      artgram_title,
      artgram_desc
    );
    return patchartgram;
  };

  removeArtgram = async (artgramId) => {
    const deleteartgram = await this.artgramRepository.removeArtgram(artgramId);
    return deleteartgram;
  };
}

module.exports = ArtgramService;
