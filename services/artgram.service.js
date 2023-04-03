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

  //   postArtgram = async (artgramId) => {
  //     const artgram = await this.artgramRepository.postArtgram(artgramId);
  //     return artgram;
  //   };

  //   modifyArtgram = async (artgramId) => {
  //     const artgram = await this.artgramRepository.modifyArtgram(artgramId);
  //     return artgram;
  //   };

  //   removeArtgram = async (artgramId) => {
  //     const artgram = await this.artgramRepository.removeArtgram(artgramId);
  //     return artgram;
  //   };
}

module.exports = ArtgramService;
