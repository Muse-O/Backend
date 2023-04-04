const {
  Artgrams,
  ArtgramImg,
  Users,
  UserProfile,
  ArtgramLike,
  ArtgramScrap,
  sequelize,
} = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

class ArtgramRepository extends Artgrams {
  constructor() {
    super();
  }

  //아트그램 전체조회
  allArtgrams = async () => {
    const allEmailFind = await Artgrams.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["userEmail"],
      group: ["userEmail"],
    });

    const userEmail = allEmailFind.map(
      (artgram) => artgram.dataValues.userEmail
    );
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
        {
          model: ArtgramLike,
          attributes: [
            [
              sequelize.fn("count", sequelize.col("artgram_like_id")),
              "likecount",
            ],
          ],
        },
        {
          model: ArtgramScrap,
          attributes: [
            [
              sequelize.fn("count", sequelize.col("artgram_scrap_id")),
              "scrapcount",
            ],
          ],
        },
      ],
      attributes: [
        "artgramId",
        "userEmail",
        "artgramTitle",
        "artgramDesc",
        "createdAt",
        "updatedAt",
      ],
      where: {
        userEmail: userEmail,
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
      group: ["Artgrams.artgram_id"],
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

  //아트그램 좋아요등록/취소
  likeArtgram = async (artgramId, userEmail) => {
    const likeartgram = await ArtgramLike.findOrCreate({
      where: {
        [Op.and]: [{ artgramId }, { userEmail }],
      },
      defaults: {
        artgramId,
        userEmail,
      },
    }).then(([data, created]) => {
      if (!created) {
        data.destroy();
        return "delete";
      }
      return "create";
    });
    return likeartgram;
  };

  //아트그램 스크랩등록/취소
  scrapArtgram = async (artgramId, userEmail) => {
    const scrapArtgram = await ArtgramScrap.findOrCreate({
      where: {
        [Op.and]: [{ artgramId }, { userEmail }],
      },
      defaults: {
        artgramId,
        userEmail,
      },
    }).then(([data, created]) => {
      if (!created) {
        data.destroy();
        return "delete";
      }
      return "create";
    });
    return scrapArtgram;
  };
}

module.exports = ArtgramRepository;
