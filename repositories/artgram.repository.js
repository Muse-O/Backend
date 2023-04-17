const {
  Artgrams,
  ArtgramImg,
  Users,
  UserProfile,
  ArtgramLike,
  ArtgramScrap,
  ArtgramHashtag,
  ArtgramsComment,
} = require("../models");
const { Op, Sequelize } = require("sequelize");
const dayjs = require("dayjs");

class ArtgramRepository extends Artgrams {
  constructor() {
    super();
  }
  /**
   * 로그인시 아트그램 전체조회
   * @param {number} limit 요청할 아트그램 게시글 수
   * @param {number} offset 조회 아트그램 게시글 시작점
   * @returns artgrams
   */

  allArtgrams = async (limit, offset, userEmail) => {
    const myuserEmail = userEmail;
    const artgrams = await Artgrams.findAll({
      raw: true,
      attributes: ["artgramId", "artgramTitle", "userEmail", "createdAt"],
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl"],
          where: {
            imgOrder: 1,
          },
        },
      ],
      where: {
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
    const findArtgrmas = await Promise.all(
      artgrams.map(async (artgram) => {
        const userEmail = artgram.userEmail;
        const user = await Users.findOne({
          where: { userEmail: userEmail },
          include: [
            {
              model: UserProfile,
              attributes: ["profileNickname", "profileImg"],
            },
          ],
        });

        const userProfile = user.UserProfile;
        const artgramId = artgram.artgramId;

        const likeCount = await ArtgramLike.count({
          where: { artgramId: artgramId },
        });
        const scrapCount = await ArtgramScrap.count({
          where: { artgramId: artgramId },
        });

        // 현재 사용자가 좋아요를 누른 Artgram이 있는지 확인
        const likedByCurrentUser = await ArtgramLike.findOne({
          where: {
            userEmail: myuserEmail,
            artgramId: artgramId,
          },
        });
        const scrapByCurrentUser = await ArtgramScrap.findOne({
          where: {
            userEmail: myuserEmail,
            artgramId: artgramId,
          },
        });

        const imgCount = await ArtgramImg.count({
          where: { artgramId: artgramId },
        });

        const { "ArtgramImgs.imgUrl": _, ...rest } = artgram;

        return {
          ...rest,
          nickname: userProfile.profileNickname,
          profileImg: userProfile.profileImg,
          imgUrl: artgram["ArtgramImgs.imgUrl"],
          likeCount,
          imgCount,
          scrapCount,
          liked: !!likedByCurrentUser,
          scrap: !!scrapByCurrentUser,
          createdAt: dayjs(artgram.createdAt)
            .locale("en")
            .format("YYYY-MM-DD HH:mm:ss"),
        };
      })
    );

    const sortedArtgramList = findArtgrmas.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
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
      sortedArtgramList: {
        count: artgrams.count,
        findArtgrmas,
      },
      paginationInfo,
    };
  };

  /**
   * 비로그인시 전체조회
   * @param {*} limit
   * @param {*} offset
   * @returns
   */
  publicAllArtgrams = async (limit, offset) => {
    const artgrams = await Artgrams.findAll({
      raw: true,
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl"],
          where: {
            imgOrder: 1,
          },
        },
      ],
      attributes: ["artgramId", "artgramTitle", "userEmail", "createdAt"],
      where: {
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const findArtgrmas = await Promise.all(
      artgrams.map(async (artgram) => {
        const userEmail = artgram.userEmail;
        const user = await Users.findOne({
          where: { userEmail: userEmail },
          include: [
            {
              model: UserProfile,
              attributes: ["profileNickname", "profileImg"],
            },
          ],
        });

        const userProfile = user.UserProfile;
        const artgramId = artgram.artgramId;

        const likeCount = await ArtgramLike.count({
          where: { artgramId: artgramId },
        });
        const imgCount = await ArtgramImg.count({
          where: { artgramId: artgramId },
        });
        const scrapCount = await ArtgramScrap.count({
          where: { artgramId: artgramId },
        });
        //객체 구조분해를 사용해서 artgram행을 사용해서ArtgramImgs.imgUrl을 제거해줌
        const { "ArtgramImgs.imgUrl": _, ...rest } = artgram;

        return {
          ...rest,
          nickname: userProfile.profileNickname,
          profileImg: userProfile.profileImg,
          imgUrl: artgram["ArtgramImgs.imgUrl"],
          likeCount,
          imgCount,
          scrapCount,
          createdAt: dayjs(artgram.createdAt)
            .locale("en")
            .format("YYYY-MM-DD HH:mm:ss"),
        };
      })
    );
    const sortedArtgramList = findArtgrmas.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
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
      sortedArtgramList: {
        count: artgrams.count,
        findArtgrmas,
      },
      paginationInfo,
    };
  };

  /**
   * 로그인시 상세조회
   * @returns
   */
  detailArtgram = async (artgramId, userEmail) => {
    const myuserEmail = userEmail;
    const thisArtgram = await Artgrams.findOne({
      where: {
        artgramId,
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
      attributes: [
        "userEmail",
        "artgramId",
        "artgramTitle",
        "artgramDesc",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl", "imgOrder"],
        },
      ],

      group: ["Artgrams.artgram_id"],
      order: [["createdAt", "DESC"]],
    });

    const user = await Users.findOne({
      where: { userEmail: thisArtgram.dataValues.userEmail },
    });

    const userProfile = await UserProfile.findOne({
      where: { userEmail: user.dataValues.userEmail },
      attributes: ["profileNickname", "profileImg"],
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

    const ArtgramImgs = await getArtgramImages(artgramId);
    let tagNames = null;
    const hasTag = await ArtgramHashtag.findAll({
      attributes: ["tagName"],
      where: { artgramId: artgramId },
    });
    if (hasTag && Array.isArray(hasTag)) {
      tagNames = hasTag.map((tag) => tag.tagName);
    }

    const artgramLikeCount = await ArtgramLike.count({
      where: { artgramId: artgramId },
    });
    const artgramScrapCount = await ArtgramScrap.count({
      where: { artgramId: artgramId },
    });
    const artgramComments = await ArtgramsComment.findAll({
      where: { artgramId: artgramId },
      attributes: ["commentId"],
    });
    const artgramCommentCount = artgramComments.length;

    // 현재 사용자가 좋아요를 누른 Artgram이 있는지 확인
    const likedByCurrentUser = await ArtgramLike.findOne({
      where: {
        userEmail: myuserEmail,
        artgramId: thisArtgram.dataValues.artgramId,
      },
    });
    const scrapByCurrentUser = await ArtgramScrap.findOne({
      where: {
        userEmail: myuserEmail,
        artgramId: thisArtgram.dataValues.artgramId,
      },
    });

    const detailArtgram = {
      ...thisArtgram.toJSON(),
      nickname: userProfile.profileNickname,
      profileImg: userProfile.profileImg,
      ArtgramImgs,
      hashtag: tagNames,
      artgramLikeCount,
      artgramScrapCount,
      artgramCommentCount,
      liked: !!likedByCurrentUser,
      scrap: !!scrapByCurrentUser,
      createdAt: thisArtgram.createdAt,
      // : dayjs(thisArtgram.createdAt)
      //   .locale("en")
      //   .format("YYYY-MM-DD HH:mm:ss"),
    };

    return { detailArtgram };
  };

  /**
   * 비로그인 상세정보
   * @param {*} artgramId
   * @returns
   */
  publicDetailArtgram = async (artgramId) => {
    const artgram = await Artgrams.findOne({
      where: {
        artgramId,
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
      attributes: [
        "artgramId",
        "userEmail",
        "artgramTitle",
        "artgramDesc",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl", "imgOrder"],
        },
      ],

      group: ["Artgrams.artgram_id"],
      order: [["createdAt", "DESC"]],
    });

    const user = await Users.findOne({
      where: { userEmail: artgram.userEmail },
      include: [
        { model: UserProfile, attributes: ["profileNickname", "profileImg"] },
      ],
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
    const ArtgramImgs = await getArtgramImages(artgramId);
    let tagNames = null;
    const hasTag = await ArtgramHashtag.findAll({
      attributes: ["tagName"],
      where: { artgramId: artgramId },
    });
    if (hasTag && Array.isArray(hasTag)) {
      tagNames = hasTag.map((tag) => tag.tagName);
    }

    const artgramLikeCount = await ArtgramLike.count({
      where: { artgramId: artgramId },
    });
    const artgramScrapCount = await ArtgramScrap.count({
      where: { artgramId: artgramId },
    });
    const artgramComments = await ArtgramsComment.findAll({
      where: { artgramId: artgramId },
      attributes: ["commentId"],
    });
    const artgramCommentCount = artgramComments.length;

    const detailArtgram = {
      ...artgram.toJSON(),
      nickname: user.UserProfile.profileNickname,
      profileImg: user.UserProfile.profileImg,
      ArtgramImgs,
      hashtag: tagNames,
      artgramLikeCount,
      artgramScrapCount,
      artgramCommentCount,
      createdAt: artgram.createdAt,
      // : dayjs(artgram.createdAt)
      //   .locale("en")
      //   .format("YYYY-MM-DD HH:mm:ss"),
    };

    return { detailArtgram };
  };

  /**
   * 아트그램 작성
   * @param {string} userEmail
   * @param {string} artgramTitle
   * @param {string} artgramDesc
   * @param {string} imgUrl
   * @returns 아트그램 작성결과 createArtgram, artgramImgs
   */
  postArtgram = async (
    userEmail,
    artgramTitle,
    artgramDesc,
    imgUrl,
    hashtag
  ) => {
    let artgramImgs = [];
    let hashTag = [];
    const createArtgram = await Artgrams.create({
      userEmail,
      artgramTitle,
      artgramDesc,
    });
    if (hashtag) {
      const tags = Array.isArray(hashtag)
        ? hashtag
        : hashtag.split(/[\[\],]+/).filter((tag) => tag.trim().length > 0);

      for (let i = 0; i < tags.length; i++) {
        if (tags.length > 0) {
          const tagname = await ArtgramHashtag.create({
            artgramId: createArtgram.artgramId,
            tagName: tags[i].trim(),
          });
          hashTag.push(tagname);
        }
      }
    }

    if (!imgUrl || imgUrl.length === 0) {
      return createArtgram;
    } else if (Array.isArray(imgUrl)) {
      for (let i = 0; i < imgUrl.length; i++) {
        const artgramImg = await ArtgramImg.create({
          artgramId: createArtgram.artgramId,
          imgUrl: imgUrl[i].trim(),
          imgOrder: i + 1,
          hashtag: hashTag.tagName,
        });
        artgramImgs.push(artgramImg);
      }
    } else {
      let splitImg = imgUrl.split(",");
      for (let i = 0; i < splitImg.length; i++) {
        const artgramImg = await ArtgramImg.create({
          artgramId: createArtgram.artgramId,
          imgUrl: splitImg[i].trim(),
          imgOrder: i + 1,
          hashtag: hashTag.tagName,
        });
        artgramImgs.push(artgramImg);
      }
    }

    return [createArtgram, artgramImgs, hashTag];
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
