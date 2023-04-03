const { Artgrams, ArtgramImg, UserProfile } = require("../models");
const { Op } = require("sequelize");

class ArtgramRepository extends Artgrams {
  constructor() {
    super();
  }

  allArtgrams = async () => {
    const artgrams = await Artgrams.findAll({
      raw: true,
      include: [
        {
          model: ArtgramImg,
          attributes: [],
        },
      ],
      attributes: [
        "artgramId",
        "userEmail",
        // "UserProfile.profile_nickname",
        // "UserProfile.profile_img",
        // "ArtgramImg.img_url",
        "artgramTitle",
        "artgramDesc",
        // "like_count",
        // "comment_count",
        "createdAt",
        "updatedAt",
      ],
      where: {
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
    });
    return artgrams;
  };

  postArtgram = async (userEmail, imgUrl, artgramTitle, artgramDesc) => {
    const createArtgram = await Artgrams.create({
      where: { ArtgramImg },
      userEmail,
      imgUrl: ArtgramImg.imgUrl,
      artgramTitle,
      artgramDesc,
    });
    return createArtgram;
  };

  modifyArtgram = async (artgramId, artgram_title, artgram_desc) => {
    const cngArtgram = await Artgrams.update({
      artgramId,
      artgram_title,
      artgram_desc,
    });
    return cngArtgram;
  };

  removeArtgram = async (artgramId) => {
    const deleteArtgram = await Artgrams.update({
      where: [{ artgramId }],
      attributes: [
        {
          artgram_status: AS04,
        },
      ],
    });
    return deleteArtgram;
  };
}

module.exports = ArtgramRepository;
