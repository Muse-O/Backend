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
const artgramModify = require("../modules/artgramModify");
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
   * @param {local.user} userEmail or "guest"
   * @returns sortedArtgramList AS04제외 조회 스크랩/좋아요 유무확인가능
   */
  getAllArtgram = async (limit, offset) => {
    const findAllArtgrams = await Artgrams.findAll({
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
    return findAllArtgrams;
  };

  getArtgramCounts = async () => {
    const artgramCnt = await Artgrams.count();
    return artgramCnt;
  };

  getUserProfileByEmail = async (userEmail) => {
    const user = await Users.findOne({
      where: { userEmail: userEmail },
      include: [
        {
          model: UserProfile,
          attributes: ["profileNickname", "profileImg"],
        },
      ],
    });
    return user;
  };

  getArtgramLikeCount = async (artgramId) => {
    const likeCount = await ArtgramLike.count({
      where: { artgramId: artgramId },
    });
    return likeCount;
  };

  getArtgramScrapCount = async (artgramId) => {
    const scrapCount = await ArtgramScrap.count({
      where: { artgramId: artgramId },
    });
    return scrapCount;
  };

  getArtgramImgCount = async (artgramId) => {
    const imgCount = await ArtgramImg.count({
      where: { artgramId: artgramId },
    });
    return imgCount;
  };

  findArtgramLike = async (userEmail, artgramId) => {
    const likedByCurrentUser = await ArtgramLike.findOne({
      where: {
        userEmail: userEmail,
        artgramId: artgramId,
      },
    });
    return likedByCurrentUser;
  };

  findArtgramScrap = async (userEmail, artgramId) => {
    const scrapByCurrentUser = await ArtgramScrap.findOne({
      where: {
        userEmail: userEmail,
        artgramId: artgramId,
      },
    });
    return scrapByCurrentUser;
  };

  /**
   * 로그인시 상세조회
   * @param {Locals.user} userEmail
   * @param {params} artgramId
   * @returns detailArtgram AS04제외 좋아요/스크랩유무확인가능
   */
  loadDetailArtgram = async (artgramId, userEmail) => {
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
      createdAt: dayjs(thisArtgram.createdAt)
        .locale("en")
        .format("YYYY-MM-DD HH:mm:ss"),
    };

    return { detailArtgram };
  };

  /**
   * 비로그인 상세정보
   * @param {Locals.user} userEmail
   * @param {params} artgramId
   * @returns detailArtgram AS04제외 좋아요/스크랩유무제외
   */
  loadPublicDetailArtgram = async (artgramId) => {
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
      createdAt: dayjs(artgram.createdAt)
        // .locale("en")
        .format("YYYY-MM-DD HH:mm:ss"),
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
  creatingAnArtgram = async (
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
    //trim() 양쪽끝 공백제거
    if (hashtag) {
      const tags = Array.isArray(hashtag)
        ? hashtag
        : hashtag.split(/[\[\],]+/).filter((tag) => tag.trim().length > 0);

      hashTag = await Promise.all(
        tags.map(async (tag) => {
          const tagname = await ArtgramHashtag.create({
            artgramId: createArtgram.artgramId,
            tagName: tag.trim(),
          });
          return tagname;
        })
      );
    }

    if (imgUrl && imgUrl.length > 0) {
      const images = Array.isArray(imgUrl) ? imgUrl : imgUrl.split(",");

      artgramImgs = await Promise.all(
        images.map(async (image, index) => {
          const artgramImg = await ArtgramImg.create({
            artgramId: createArtgram.artgramId,
            imgUrl: image.trim(),
            imgOrder: index + 1,
            hashtag: hashTag.tagName,
          });
          return artgramImg;
        })
      );
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
  ArtgramToModify = async (
    artgramId,
    artgramTitle,
    artgramDesc,
    imgUrlArray,
    hashtag
  ) => {
    const changeArtgram = await Artgrams.update(
      {
        artgramTitle,
        artgramDesc,
      },
      {
        where: { artgramId },
      }
    );

    const modify = await artgramModify(artgramId, imgUrlArray, hashtag);
    // // 1. 기존 해시태그 가져오기
    // const existingHashtags = await ArtgramHashtag.findAll({
    //   where: { artgramId },
    // });

    // // 2. 새 해시태그를 기준으로 추가 및 업데이트 수행
    // for (let newHashtag of hashtag) {
    //   const existingHashtag = existingHashtags.find(
    //     (h) => h.tagName === newHashtag
    //   );

    //   if (existingHashtag) {
    //     // 해시태그가 이미 존재하면 업데이트
    //     await ArtgramHashtag.update(
    //       { tagName: newHashtag },
    //       { where: { artgramTagId: existingHashtag.artgramTagId } }
    //     );
    //   } else {
    //     // 해시태그가 존재하지 않으면 추가
    //     await ArtgramHashtag.create({ tagName: newHashtag, artgramId });
    //   }
    // }

    // // 3. 기존 해시태그를 기준으로 삭제 수행
    // for (let existingHashtag of existingHashtags) {
    //   if (!hashtag.includes(existingHashtag.tagName)) {
    //     // 새 해시태그에 없는 경우 삭제
    //     await ArtgramHashtag.destroy({
    //       where: { artgramTagId: existingHashtag.artgramTagId },
    //     });
    //   }
    // }
    // // 1. 기존 이미지 가져오기
    // const existingImgs = await ArtgramImg.findAll({
    //   where: { artgramId },
    // });

    // // 2. 새 이미지를 기준으로 추가 및 업데이트 수행
    // let imgOrder = 1;
    // for (let newImg of imgUrlArray) {
    //   const existingImg = existingImgs.find((h) => h.tagName === newImg);

    //   if (existingImg) {
    //     // 이미지가 이미 존재하면 업데이트
    //     await ArtgramImg.update(
    //       { imgUrl: newImg, imgOrder },
    //       { where: { artgramImgId: existingImg.artgramImgId } }
    //     );
    //   } else {
    //     // 이미지가 존재하지 않으면 추가
    //     await ArtgramImg.create({ imgOrder, imgUrl: newImg, artgramId });
    //   }
    //   imgOrder++; // imgOrder 속성 값 증가
    // }

    // // 3. 기존 이미지를 기준으로 삭제 수행
    // for (let existingImg of existingImgs) {
    //   if (!imgUrlArray.includes(existingImg.tagName)) {
    //     // 새 이미지에 없는 경우 삭제
    //     await ArtgramImg.destroy({
    //       where: { artgramImgId: existingImg.artgramImgId },
    //     });
    //   }
    // }

    return changeArtgram;
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
  artgramWithLike = async (artgramId, userEmail) => {
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
   * 아트그램 게시글 좋아요 시 작성자에게 알림 발송하기 위해 작성자 조회
   * @param {string} artgramId
   * @returns 아트그램 게시글 작성자 이메일
   */
  findNotiReceiver = async (artgramId) => {
    const author = await Artgrams.findByPk(artgramId, {
      attributes: ["user_email"],
    });

    return author.dataValues.user_email;
  };

  /**
   * 아트그램 스크랩등록/취소
   * @param {string} artgramId
   * @param {string} userEmail
   * @returns 아트그램 스크랩등록/취소여부 반환 scrapArtgram
   */
  artgramWithScrap = async (artgramId, userEmail) => {
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
