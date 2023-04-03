const { Artgrams } = require("../models");

class ArtgramRepository extends Artgrams {
  constructor() {
    super();
  }

  allArtgrams = async () => {
    const artgrams = await Artgrams.findAll({
      attributes: [
        "artgram_id",
        "user_email",
        // "nickname",
        // "profile_image",
        // "image",
        "artgram_title",
        "artgram_desc",
        // "like_count",
        // "comment_count",
        "created_at",
        "updated_at",
      ],
    });
    return artgrams;
  };

  //   postArtgram = async () => {
  //     const createArtgram = await Artgrams.create({});
  //     return createArtgram;
  //   };

  //   modifyArtgram = async () => {
  //     const cngArtgram = await Artgrams.update({});
  //     return createArtgram;
  //   };

  //   removeArtgram = async () => {
  //     const deleteArtgram = await Artgrams.update({});
  //     return deleteArtgram;
  //   };
}

module.exports = ArtgramRepository;
