const {
  SearchHistory,
  Artgrams,
  Exhibitions,
  Users,
  UserProfile,
  ArtgramHashtag,
  ArtgramImg,
  ExhibitionImg,
  ExhibitionLike,
  ExhibitionScrap,
  ExhibitionAddress,
} = require("../models");
const { searchArtgram } = require("../modules/searchArtgrams");
const dayjs = require("dayjs");
const { Sequelize, Op } = require("sequelize");
const RedisClient = require("../config/redisConnector");
const {
  createFuzzyMatcherKor,
  ch2pattern,
  isKorean,
  createFuzzyMatcherEng,
  isEnglish,
  removeSpecialCharacters,
} = require("../schemas/searchForInitial");

class SearchRepositroy extends SearchHistory {
  constructor() {
    super();
    this.redisClient = RedisClient.getClient();
  }
  /**
   * 유저가 검색후 선택한 게시글저장
   * @param {string} title
   * @param {string} type
   * @returns
   */
  selectResult = async (title, type, userEmail) => {
    const savedResult = await SearchHistory.create({
      keyWord: title,
      type: type,
      userEmail: userEmail,
    });
    return savedResult;
  };

  /**
   * 유저가 검색후 선택한 게시글저장
   * @param {string} title
   * @param {string} type
   * @returns
   */
  selectResult = async (title, type, userEmail) => {
    const savedResult = await SearchHistory.create({
      keyWord: title,
      type: type,
      userEmail: userEmail,
    });
    return savedResult;
  };
  /**
   * 아트그램 검색
   * @param {string} searchText
   * @returns
   */
  autocompleteArtgrams = async (searchText, userEmail) => {
    const myuserEmail = userEmail;
    const removeSpecialCharacters = (searchText) => {
      // 모든 특수문자를 제거하는 정규식
      const regex = /[^\u3131-\u314e\u314f-\u3163\uac00-\ud7a3\w\s]/g;
      return searchText.replace(regex, "");
    };
    //특수문자를 제거해주는 코드
    const SearchText = removeSpecialCharacters(searchText);
    //입력된 문자열을 문자 단위로 분해한다
    let characters = SearchText.split("");

    // 한글과 영어,기타로 문자를 분리한다.
    const koreanChars = characters.filter(ch2pattern);
    const englishChars = characters.filter(isEnglish);
    const otherChars = characters
      .filter((char) => !isKorean(char))
      .filter((char) => !isEnglish(char));
    let chosungText = "";
    let engText = "";
    //한글문자가 있다면 초성검색 패턴을 생성한다.
    if (koreanChars.length > 0) {
      chosungText = createFuzzyMatcherKor(koreanChars.join(""));
      if (chosungText === null) {
        console.error("초성값이 존재하지않습니다");
        chosungText = "";
      }
    }
    if (englishChars.length > 0) {
      engText = createFuzzyMatcherEng(englishChars.join(""));
      if (engText === null) {
        console.error("알파벳없음");
        engText = "";
      }
    }
    //기타문자를 하나의 문자열로 연결
    const otherCharsText = otherChars.join("");
    const titleConditions = [];
    const descConditions = [];
    const hashtagConditions = [];
    //데이터 베이스에서 일치하는 결과를 검색
    if (otherCharsText) {
      titleConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
      descConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
      hashtagConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
    }
    if (chosungText) {
      titleConditions.push({ [Sequelize.Op.regexp]: chosungText });
      descConditions.push({ [Sequelize.Op.regexp]: chosungText });
      hashtagConditions.push({ [Sequelize.Op.regexp]: chosungText });
    }
    if (engText) {
      titleConditions.push({ [Sequelize.Op.regexp]: engText });
      descConditions.push({ [Sequelize.Op.regexp]: engText });
      hashtagConditions.push({ [Sequelize.Op.regexp]: engText });
    }

    const artgramResults = await Artgrams.findAll({
      attributes: [
        "artgramId",
        "userEmail",
        "artgramTitle",
        "artgramDesc",
        "createdAt",
        "artgramStatus",
      ],
      where: {
        artgramStatus: {
          [Op.ne]: "AS04",
        },
        [Sequelize.Op.or]: [
          { artgramTitle: { [Sequelize.Op.or]: titleConditions } },
          { artgramDesc: { [Sequelize.Op.or]: descConditions } },
        ],
      },
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl"],
          where: {
            imgOrder: 1,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const hashtagResults = await ArtgramHashtag.findAll({
      attributes: ["artgramId"],
      where: {
        tagName: { [Sequelize.Op.or]: hashtagConditions },
      },
    });

    const hashtagArtgramIds = hashtagResults.map(
      (hashtag) => hashtag.artgramId
    );
    const combinedArtgramIds = [
      ...new Set([
        ...artgramResults.map((artgram) => artgram.artgramId),
        ...hashtagArtgramIds,
      ]),
    ];

    const searchResults = await Artgrams.findAll({
      where: { artgramId: { [Sequelize.Op.in]: combinedArtgramIds } },
      include: [
        {
          model: ArtgramImg,
          attributes: ["imgUrl"],
          where: {
            imgOrder: 1,
          },
        },
        {
          model: ArtgramHashtag,
          attributes: ["tagName"],
        },
      ],
    });

    const uniqueResults = await searchArtgram(searchResults, myuserEmail);

    return uniqueResults;
  };

  /**
   * 전시회 검색
   * @param {string} searchText
   * @returns
   */
  autocompleteExhibition = async (searchText, userEmail) => {
    const myuserEmail = userEmail;
    const removeSpecialCharacters = (searchText) => {
      // 모든 특수문자를 제거하는 정규식
      const regex = /[^\u3131-\u314e\u314f-\u3163\uac00-\ud7a3\w\s]/g;
      return searchText.replace(regex, "");
    };
    //특수문자를 제거해주는 코드
    const SearchText = removeSpecialCharacters(searchText);
    let characters = SearchText.split("");

    // 한글과 기타로 문자를 분리한다.
    const koreanChars = characters.filter(ch2pattern);
    const englishChars = characters.filter(isEnglish);
    const otherChars = characters
      .filter((char) => !isKorean(char))
      .filter((char) => !isEnglish(char));

    let chosungText = "";
    let engText = "";

    //한글문자가 있다면 초성검색 패턴을 생성한다.
    if (koreanChars.length > 0) {
      chosungText = createFuzzyMatcherKor(koreanChars.join(""));
      if (chosungText === null) {
        console.error("초성값이 존재하지않습니다");
        chosungText = "";
      }
    }
    if (englishChars.length > 0) {
      engText = createFuzzyMatcherEng(englishChars.join(""));
      if (engText === null) {
        console.error("알파벳없음");
        engText = "";
      }
    }

    const otherCharsText = otherChars.join("");

    const titleConditions = [];
    const descConditions = [];
    const engTitleConditions = [];

    if (otherCharsText) {
      titleConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
      descConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
      engTitleConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
    }

    if (chosungText) {
      titleConditions.push({ [Sequelize.Op.regexp]: chosungText });
      descConditions.push({ [Sequelize.Op.regexp]: chosungText });
      engTitleConditions.push({ [Sequelize.Op.regexp]: chosungText });
    }

    if (engText) {
      titleConditions.push({ [Sequelize.Op.regexp]: engText });
      descConditions.push({ [Sequelize.Op.regexp]: engText });
      engTitleConditions.push({ [Sequelize.Op.regexp]: engText });
    }
    const rows = await Exhibitions.findAll({
      include: [
        {
          model: ExhibitionAddress,
          attributes: ["address"],
        },
      ],
      attributes: [
        "exhibitionId",
        "exhibitionEngTitle",
        "exhibitionTitle",
        "startDate",
        "endDate",
        "createdAt",
        "postImage",
      ],
      where: {
        exhibition_status: {
          [Op.ne]: "ES04",
        },
        [Sequelize.Op.or]: [
          { exhibitionTitle: { [Sequelize.Op.and]: titleConditions } },
          { exhibitionDesc: { [Sequelize.Op.and]: descConditions } },
          { exhibitionEngTitle: { [Sequelize.Op.and]: engTitleConditions } },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    const searchExhibition = await Promise.all(
      rows.map(async (exhibition) => {
        const exhibitionId = exhibition.exhibitionId;

        let address = "";

        if (exhibition.ExhibitionAddress !== null) {
          address = exhibition.ExhibitionAddress.address
            .split(" ")
            .slice(0, 2)
            .join(" ");
        }

        const { ExhibitionAddress, ...rest } = exhibition.dataValues;

        const likedByCurrentUser =
          myuserEmail !== "guest" && myuserEmail !== undefined
            ? await ExhibitionLike.findOne({
                where: {
                  userEmail: myuserEmail,
                  exhibitionId,
                },
              })
            : null;

        const scrapByCurrentUser =
          myuserEmail !== "guest" && myuserEmail !== undefined
            ? await ExhibitionScrap.findOne({
                where: {
                  userEmail: myuserEmail,
                  exhibitionId,
                },
              })
            : null;

        const exhibitionObject = {
          ...rest,
          detailRouter: `/exhibition/detail/${exhibitionId}`,
          address,
          type: "exhibition",
          liked: !!likedByCurrentUser,
          scrap: !!scrapByCurrentUser,
          createdAt: dayjs(exhibition.createdAt)
            .locale("en")
            .format("YYYY-MM-DD HH:mm:ss"),
        };
        return exhibitionObject;
      })
    );

    return searchExhibition;
  };

  /**-----------
   * 유저검색
   */
  findUsers = async (searchText) => {
    const removeSpecialCharacters = (searchText) => {
      // 모든 특수문자를 제거하는 정규식
      const regex = /[^\u3131-\u314e\u314f-\u3163\uac00-\ud7a3\w\s]/g;
      return searchText.replace(regex, "");
    };
    //특수문자를 제거해주는 코드
    const SearchText = removeSpecialCharacters(searchText);

    //입력된 문자열을 문자 단위로 분해한다
    let characters = SearchText.split("");

    // 한글과 영어,기타로 문자를 분리한다.
    const koreanChars = characters.filter(ch2pattern);
    const englishChars = characters.filter(isEnglish);
    const otherChars = characters
      .filter((char) => !isKorean(char))
      .filter((char) => !isEnglish(char));

    let chosungText = "";
    let engText = "";
    //한글문자가 있다면 초성검색 패턴을 생성한다.
    if (koreanChars.length > 0) {
      chosungText = createFuzzyMatcherKor(koreanChars.join(""));
      if (chosungText === null) {
        console.error("초성값이 존재하지않습니다");
        chosungText = "";
      }
    }
    if (englishChars.length > 0) {
      engText = createFuzzyMatcherEng(englishChars.join(""));
      if (engText === null) {
        console.error("알파벳없음");
        engText = "";
      }
    }

    //기타문자를 하나의 문자열로 연결
    const otherCharsText = otherChars.join("");
    const findUserEmail = [];
    const findProfileNickname = [];

    //데이터 베이스에서 일치하는 결과를 검색
    if (otherCharsText) {
      findUserEmail.push({ [Sequelize.Op.regexp]: otherCharsText });
      findProfileNickname.push({ [Sequelize.Op.regexp]: otherCharsText });
    }

    if (chosungText) {
      findUserEmail.push({ [Sequelize.Op.regexp]: chosungText });
      findProfileNickname.push({ [Sequelize.Op.regexp]: chosungText });
    }

    if (engText) {
      findUserEmail.push({ [Sequelize.Op.regexp]: engText });
      findProfileNickname.push({ [Sequelize.Op.regexp]: engText });
    }

    if (findUserEmail.length === 0 && findProfileNickname.length === 0) {
      return [[], []]; // 빈 배열을 반환하여 검색 결과가 없음을 나타냅니다.
    }

    const rows = await Users.findAll({
      attributes: ["userEmail"],
      include: [
        {
          model: UserProfile,
          attributes: ["profileId", "profileNickname", "profileImg"],
          required: false,
        },
      ],
      where: {
        user_status: {
          [Op.ne]: "US04",
        },
        [Sequelize.Op.or]: [
          {
            userEmail: {
              [Sequelize.Op.or]: findUserEmail,
            },
          },
          {
            "$UserProfile.profile_nickname$": {
              [Sequelize.Op.or]: findProfileNickname,
            },
          },
        ],
      },
      limit: 5,
    });

    let userSearch = [];
    if (rows.length > 0) {
      userSearch = rows.map((row) => ({
        type: "user",
        userEmail: row.userEmail,
        profileId: row.UserProfile.profileId,
        profileNickname: row.UserProfile.profileNickname,
        profileImg: row.UserProfile.profileImg,
      }));
    }

    return userSearch;
  };

  /**
   * 최근검색기록 TOP10
   * @locals {staring} userEmail
   * @returns
   */
  recentSearchHistory = async (userEmail) => {
    const findRecentHistory = await SearchHistory.findAll({
      where: { userEmail },
      attributes: ["keyWord", "type", "createdAt"],
      limit: 15,
      order: [["createdAt", "DESC"]],
    });
    return findRecentHistory;
  };

  /**
   * 인기검색어 TOP10
   */
  searchByRank = async () => {
    const findByRank = await SearchHistory.findAll({
      attributes: [
        "keyWord",
        "type",
        [Sequelize.fn("COUNT", Sequelize.col("key_word")), "count"],
      ],
      group: ["keyWord", "type"],
      order: [[Sequelize.literal("count"), "DESC"]],
      limit: 10,
    });
    return findByRank;
  };

  /**
   * 연관 검색어 기능(미구현)
   */
  //   searchTerms = async (searchTerm) => {
  //     const rows = await Artgrams.findAll({
  //       attributes: ["artgram_title", "artgram_desc"],
  //       where: Sequelize.literal(
  //         `MATCH(artgram_title, artgram_desc) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)`
  //       ),
  //       replacements: { searchTerm },
  //     }).concat(
  //       await Exhibitions.findAll({
  //         attributes: ["exhibition_title", "exhibition_desc"],
  //         where: Sequelize.literal(
  //           `MATCH(exhibition_title, exhibition_desc) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)`
  //         ),
  //         replacements: { searchTerm },
  //       })
  //     );

  //     const relatedSearchTerms = rows.map(
  //       (row) =>
  //         row.artgram_title + " " + row.artgram_desc ||
  //         row.exhibition_title + " " + row.exhibition_desc
  //     );

  //     const results = await client.search({
  //       index: "your_elasticsearch_index_name",
  //       body: {
  //         query: {
  //           match: {
  //             your_elasticsearch_field_name: relatedSearchTerms.join(" "),
  //           },
  //         },
  //       },
  //     });

  //     const hits = results.hits.hits;
  //     const relatedSearchTermsInElasticsearch = hits.map(
  //       (hit) => hit._source.your_elasticsearch_field_name
  //     );
  //     return relatedSearchTermsInElasticsearch;
  //   };
}

module.exports = SearchRepositroy;
