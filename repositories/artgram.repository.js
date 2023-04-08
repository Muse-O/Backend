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

  /**
   * 아트그램 전체조회
   * @param {number} limit 요청할 아트그램 게시글 수
   * @param {number} offset 조회 아트그램 게시글 시작점
   * @returns artgrams
   */
  allArtgrams = async (limit, offset) => {
    const allEmailFind = await Artgrams.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["userEmail"],
      group: ["userEmail"],
    });

    const userEmail = allEmailFind.map(
      (artgram) => artgram.dataValues.userEmail
    );

    const users = await Users.findAll({
      where: { userEmail: userEmail },
      include: [{ model: UserProfile }],
    });

    const profileData = users.reduce((acc, user) => {
      acc[user.userEmail] = {
        profileNickname: user.UserProfile.profileNickname,
        profileImg: user.UserProfile.profileImg,
      };
      return acc;
    }, {});

    const artgrams = await Artgrams.findAll({
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
      include: [{ model: ArtgramImg, attributes: ["imgUrl", "imgOrder"] }],
      group: ["Artgrams.artgram_id"],
      order: [["createdAt", "DESC"]],
      distinct: true,
      limit: limit,
      offset: offset,
    });

    const getArtgramImages = async (artgramId) => {
      const artgramImages = await ArtgramImg.findAll({
        attributes: ["imgUrl", "imgOrder"],
        where: { artgramId: artgramId },
        order: [["imgOrder", "ASC"]],
        distinct: true,
      });

      return artgramImages;
    };

    const findArtgrams = await Promise.all(
      artgrams.map(async (artgram) => {
        const artgramId = artgram.artgramId;
        const ArtgramImgs = await getArtgramImages(artgramId);

        return {
          ...artgram.toJSON(),
          ...profileData[artgram.userEmail],
          ArtgramImgs,
        };
      })
    );
    console.log("findArtgrams", findArtgrams);

    const artgramList = await Artgrams.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const artgramCnt = await Artgrams.count();
    const hasNextPage = offset + limit < artgramCnt;

    const paginationInfo = {
      limit,
      offset,
      artgramCnt,
      hasNextPage,
    };

    return {
      artgramList: {
        count: artgramList.count,
        rows: findArtgrams,
      },
      paginationInfo,
    };
  };

  /**
   * 아트그램 작성
   * @param {string} userEmail
   * @param {string} artgramTitle
   * @param {string} artgramDesc
   * @param {string} imgUrl
   * @returns 아트그램 작성결과 createArtgram, artgramImgs
   */
  postArtgram = async (userEmail, artgramTitle, artgramDesc, imgUrl) => {
    let artgramImgs = [];
    const createArtgram = await Artgrams.create({
      userEmail,
      artgramTitle,
      artgramDesc,
    });

    if (!imgUrl || imgUrl.length === 0) {
      return createArtgram;
    } else if (imgUrl.length === 1) {
      const artgramImg = await ArtgramImg.create({
        artgramId: createArtgram.artgramId,
        imgUrl: imgUrl[0],
        imgOrder: 1,
      });
      artgramImgs.push(artgramImg);
    } else {
      let splitImg = imgUrl.join(",").split(",");
      for (let i = 0; splitImg.length > i; i++) {
        const artgramImg = await ArtgramImg.create({
          artgramId: createArtgram.artgramId,
          imgUrl: splitImg[i],
          imgOrder: i + 1,
        });
        artgramImgs.push(artgramImg);
      }
    }

    return [createArtgram, artgramImgs];
  };

  /**
   * 아트그램 수정
   * @param {string} artgramId
   * @param {string} artgramTitle
   * @param {string} artgramDesc
   * @returns 수정결과반환 cngArtgram
   */
  modifyArtgram = async (artgramId, artgramTitle, artgramDesc) => {
    const cngArtgram = await Artgrams.update(
      {
        artgramTitle,
        artgramDesc,
      },
      {
        where: { artgramId },
      }
    );
    return cngArtgram;
  };

  /**
   * 아트그램 삭제
   * @param {string} artgramId
   * @returns 아트그램 삭제결과반환 deleteArtgram
   */
  removeArtgram = async (artgramId) => {
    const deleteArtgram = await Artgrams.update(
      { artgramStatus: "AS04" },
      { where: { artgramId } }
    );
    return deleteArtgram;
  };

  /**
   * 아트그램 좋아요등록/취소
   * @param {string} artgramId
   * @param {string} userEmail
   * @returns 좋아요등록/취소여부 반환 likeartgram
   */
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

  /**
   * 아트그램 스크랩등록/취소
   * @param {string} artgramId
   * @param {string} userEmail
   * @returns 아트그램 스크랩등록/취소여부 반환 scrapArtgram
   */
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
