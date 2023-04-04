const { Artgrams, ArtgramImg, Users, UserProfile } = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const artgrams = require("../models/artgrams");

class ArtgramRepository extends Artgrams {
  constructor() {
    super();
  }

  //아트그램 전체조회
  allArtgrams = async () => {
    const latestArtgram = await Artgrams.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (!latestArtgram) {
      throw new Error("No Artgrams found");
    }

    const userEmail = latestArtgram.userEmail;
    const user = await Users.findOne({
      where: { userEmail: userEmail },
      include: [{ model: UserProfile }],
    });

    const profileNickname = user.UserProfile.profileNickname;
    const profileImg = user.UserProfile.profileImg;
    const artgrams = await Artgrams.findAll({
      raw: true,
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl"],
        },
      ],
      attributes: [
        "artgramId",
        "userEmail",
        "artgramTitle",
        "artgramDesc",
        // 'like_count',
        // 'comment_count',
        "createdAt",
        "updatedAt",
      ],
      where: {
        userEmail: userEmail,
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
    });

    const findArtgrams = artgrams.map((artgram) => ({
      ...artgram,
      profileImg,
      profileNickname,
    }));
    return findArtgrams;
  };

  //아트그램 작성
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

  //아트그램 수정
  modifyArtgram = async (artgramId, artgramTitle, artgramDesc) => {
    const cngArtgram = await Artgrams.update(
      {
        artgramId,
        artgramTitle,
        artgramDesc,
      },
      {
        where: { artgramId },
      }
    );
    return cngArtgram;
  };

  //아트그램 삭제
  removeArtgram = async (artgramId) => {
    const deleteArtgram = await Artgrams.update({
      where: [{ artgramId }],
      attributes: [
        {
          artgramStatus: AS04,
        },
      ],
    });
    return deleteArtgram;
  };
}

module.exports = ArtgramRepository;
