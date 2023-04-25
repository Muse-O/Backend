const {
  UserProfile,
  Exhibitions,
  ExhibitionLike,
  ExhibitionScrap,
  Artgrams,
  ArtgramImg,
  ArtgramLike,
  ArtgramScrap,
  sequelize,
} = require("../models");
const { parseModelToFlatObject } = require("../modules/parseModelToFlatObject");
const { Op } = require("sequelize");

class MypageRepository {
  /**
   *이메일과 일치하는 프로필 조회
   * @param {string} userEmail
   * @returns 프로필
   */
  findProfileByEmail = async (userEmail) => {
    const profile = await UserProfile.findOne({
      attributes: ["profileImg", "profileNickname", "profileIntro"],
      where: [{ user_email: userEmail }],
    });
    return profile;
  };

  /**
   *프로필 수정
   * @param {string} profileImg
   * @param {string} nickname
   * @param {string} introduction
   * @param {string} userEmail
   * @returns 수정된 프로필
   */
  updateMyProfile = async (profileImg, nickname, introduction, userEmail) => {
    const result = await UserProfile.update(
      {
        profileImg: profileImg,
        profileNickname: nickname,
        profileIntro: introduction,
      },
      { where: { user_email: userEmail } }
    );

    const updatedProfile = await this.findProfileByEmail(userEmail);
    return updatedProfile;
  };

  /**
   *내가 작성한 전시회 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns myExhibitionList, paginationInfo
   */
  findMyPostExhibition = async (limit, offset, userEmail) => {
    const myExhibition = await Exhibitions.findAll({
      attributes: ["exhibition_id", "exhibition_title", "post_image"],
      where: [
        { user_email: userEmail, exhibition_status: { [Op.ne]: "ES04" } },
      ],
      order: [["created_at", "DESC"]],
      raw: true,
      limit: limit,
      offset: offset,
      subQuery: false,
    }).then((models) => models.map(parseModelToFlatObject));

    const myExhibitionList = {
      result: myExhibition,
    };

    const myExhibitionCnt = await Exhibitions.count({
      where: {
        user_email: userEmail,
        exhibition_status: {
          [Op.ne]: "ES04",
        },
      },
    });

    const hasNextPage = offset + limit < myExhibitionCnt;
    const hasBackPage = offset > 0;

    const paginationInfo = {
      limit,
      offset,
      myExhibitionCnt,
      hasNextPage,
      hasBackPage,
    };

    return { myExhibitionList, paginationInfo };
  };

  /**
   *내가 좋아요한 전시 게시글 조회
   * @param {string} userEmail
   * @returns 좋아요한 전시게시글 아이디: array
   */
  findAllMyLikedExhibitionId = async (userEmail) => {
    const myLikes = await ExhibitionLike.findAll({
      attributes: ["exhibition_id"],
      where: [{ user_email: userEmail }],
      order: [["created_at", "DESC"]],
      raw: true,
    }).then((models) => models.map(parseModelToFlatObject));

    return myLikes;
  };

  /**
   *내가 좋아요/스크랩한 전시게시글 조회
   * @param {number} limit
   * @param {number} offset
   * @param {array} myLikedExhibitionIds myScrappedExhibitionIds
   * @returns exhibitionList, paginationInfo
   */
  findMyExhibition = async (limit, offset, myLikedExhibitionIds) => {
    const myExhibitions = await Exhibitions.findAll({
      attributes: ["exhibition_id", "exhibition_title", "post_image"],
      raw: true,
      where: {
        exhibition_id: {
          [Op.in]: myLikedExhibitionIds,
        },
        exhibition_status: { [Op.ne]: "ES04" },
      },
      order: [
        [
          sequelize.literal(
            `FIELD(exhibition_id, ${myLikedExhibitionIds
              .map((id) => `'${id}'`)
              .join(",")})`
          ),
        ],
      ],
      limit: limit,
      offset: offset,
      subQuery: false,
    }).then((models) => models.map(parseModelToFlatObject));

    const exhibitionList = {
      result: myExhibitions,
    };

    const myExhibitionCnt = await Exhibitions.count({
      where: {
        exhibition_id: {
          [Op.in]: myLikedExhibitionIds,
        },
        exhibition_status: {
          [Op.ne]: "ES04",
        },
      },
    });

    const hasNextPage = offset + limit < myExhibitionCnt;
    const hasBackPage = offset > 0;

    const paginationInfo = {
      limit,
      offset,
      myExhibitionCnt,
      hasNextPage,
      hasBackPage,
    };

    return { exhibitionList, paginationInfo };
  };

  /**
   *내가 스크랩한 전시 게시글 조회
   * @param {string} userEmail
   * @returns 스크랩한 전시게시글 아이디: array
   */
  findAllMyScrappedExhibitionId = async (userEmail) => {
    const myScraps = await ExhibitionScrap.findAll({
      attributes: ["exhibition_id"],
      where: [{ user_email: userEmail }],
      order: [["created_at", "DESC"]],
      raw: true,
    }).then((models) => models.map(parseModelToFlatObject));

    return myScraps;
  };

  /**
   *내가 작성한 아트그램 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns myArtgramList, paginationInfo
   */
  findMyPostArtgram = async (limit, offset, userEmail) => {
    const myArtgram = await Artgrams.findAll({
      attributes: ["artgram_id", "artgram_title"],
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl"],
          where: { imgOrder: 1 },
          seperate: true,
        },
      ],
      where: {
        userEmail: userEmail,
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
      order: [["createdAt", "DESC"]],
      raw: true,
      limit: limit,
      offset: offset,
      subQuery: false,
    }).then((models) => models.map(parseModelToFlatObject));

    const myArtgramList = {
      result: myArtgram,
    };

    const myArtgramCnt = await Artgrams.count({
      where: {
        userEmail: userEmail,
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
    });

    const hasNextPage = offset + limit < myArtgramCnt;
    const hasBackPage = offset > 0;

    const paginationInfo = {
      limit,
      offset,
      myArtgramCnt,
      hasNextPage,
      hasBackPage
    };

    return { myArtgramList, paginationInfo };
  };

  /**
   *내가 좋아요한 아트그램 아이디들 조회
   * @param {string} userEmail
   * @returns 좋아요한 아트그램 아이디: array
   */
  findAllMyLikedArtgramId = async (userEmail) => {
    const myLikes = await ArtgramLike.findAll({
      attributes: ["artgram_id"],
      where: [{ user_email: userEmail }],
      order: [["created_at", "DESC"]],
      raw: true,
    }).then((models) => models.map(parseModelToFlatObject));

    return myLikes;
  };

  /**
   *내 좋아요/스크랩한 아트그램 조회
   * @param {number} limit
   * @param {number} offset
   * @param {array} myLikedArtgramIds myScrappedArtgramIds
   * @returns artgramList, paginationInfo
   */
  findMyArtgram = async (limit, offset, myLikedArtgramIds) => {
    const myArtgrams = await Artgrams.findAll({
      attributes: ["artgram_id", "artgram_title"],
      raw: true,
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl"],
          where: { imgOrder: 1 },
          seperate: true,
        },
      ],
      where: {
        artgram_id: {
          [Op.in]: myLikedArtgramIds,
        },
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
      order: sequelize.literal(
        `FIELD(Artgrams.artgram_id, ${myLikedArtgramIds
          .map((id) => `'${id}'`)
          .join(",")})`
      ),
      limit: limit,
      offset: offset,
      subQuery: false,
    }).then((models) => models.map(parseModelToFlatObject));

    const artgramList = {
      result: myArtgrams,
    };

    const myArtgramCnt = await Artgrams.count({
      where: {
        artgram_id: {
          [Op.in]: myLikedArtgramIds,
        },
        artgram_status: {
          [Op.ne]: "AS04",
        },
      },
    });

    const hasNextPage = offset + limit < myArtgramCnt;
    const hasBackPage = offset > 0;

    const paginationInfo = {
      limit,
      offset,
      myArtgramCnt,
      hasNextPage,
      hasBackPage,
    };

    return { artgramList, paginationInfo };
  };

  /**
   *내가 스크랩한 아트그램 아이디들 조회
   * @param {string} userEmail
   * @returns 스크랩한 아트그램 아이디: array
   */
  findAllMyScrappedArtgramId = async (userEmail) => {
    const myLikes = await ArtgramScrap.findAll({
      attributes: ["artgram_id"],
      where: [{ user_email: userEmail }],
      order: [["created_at", "DESC"]],
      raw: true,
    }).then((models) => models.map(parseModelToFlatObject));

    return myLikes;
  };
}

module.exports = MypageRepository;
