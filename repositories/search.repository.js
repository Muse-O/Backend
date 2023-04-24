const {
  searchHistory,
  Artgrams,
  Exhibitions,
  Users,
  UserProfile,
  ArtgramHashtag,
} = require("../models");
const { Sequelize, Op } = require("sequelize");
const RedisClient = require("../config/redisConnector");
const client = require("../config/elasticSearch-Connector");
const {
  createFuzzyMatcherKor,
  ch2pattern,
  isKorean,
  createFuzzyMatcherEng,
  isEnglish,
  removeSpecialCharacters,
} = require("../schemas/searchForInitial");

class SearchRepositroy extends searchHistory {
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
    const savedResult = await searchHistory.create({
      keyWord: title,
      type: type,
    });
    return savedResult;
  };

  /**
   * 아트그램 검색
   * @param {string} searchText
   * @returns
   */
  autocompleteArtgrams = async (searchText) => {
    const hasSpecialCharcters = /[<>]/.test(searchText);
    //특수문자를 제거해주는 코드
    const SearchText = hasSpecialCharcters
      ? removeSpecialCharacters(searchText)
      : searchText;
    //레디스에 저장된값이 있는지 확인 있다면 바로 출력해줌
    const cachedArtgrams = await this.redisClient.get(
      `search:artgram:${SearchText}`
    );
    if (cachedArtgrams) {
      return JSON.parse(cachedArtgrams);
    }
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

    //데이터 베이스에서 일치하는 결과를 검색
    if (otherCharsText) {
      titleConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
      descConditions.push({ [Sequelize.Op.regexp]: otherCharsText });
    }

    if (chosungText) {
      titleConditions.push({ [Sequelize.Op.regexp]: chosungText });
      descConditions.push({ [Sequelize.Op.regexp]: chosungText });
    }

    if (engText) {
      titleConditions.push({ [Sequelize.Op.regexp]: engText });
      descConditions.push({ [Sequelize.Op.regexp]: engText });
    }

    const rows = await Artgrams.findAll({
      include: [
        {
          model: ArtgramHashtag,
          attributes: ["tag_name"],
          where: {
            tag_name: { [Sequelize.Op.or]: descConditions },
          },
        },
      ],
      attributes: ["artgramTitle", "artgramDesc"],
      where: {
        artgram_status: {
          [Op.ne]: "AS04",
        },
        [Sequelize.Op.or]: [
          { artgramTitle: { [Sequelize.Op.or]: titleConditions } },
          { artgramDesc: { [Sequelize.Op.or]: descConditions } },
        ],
      },
      limit: 5,
    });

    const artgramsWithTags = rows
      .filter((row) => row.ArtgramHashtags.length > 0)
      .map((row) => {
        const artgramTitle = row.artgramTitle;
        const hashtags = row.ArtgramHashtags.map(
          (artgramHashtag) => artgramHashtag.dataValues.tag_name
        );

        return { artgramTitle, hashtags };
      });

    //검색한 text를 저장해줌
    await this.redisClient.set(
      `search:artgram:${SearchText}`,
      JSON.stringify(artgramsWithTags),
      "EX",
      120
    );
    return artgramsWithTags;
  };

  /**
   * 전시회 검색
   * @param {string} searchText
   * @returns
   */
  autocompleteExhibition = async (searchText) => {
    const hasSpecialCharcters = /[<>]/.test(searchText);
    //특수문자를 제거해주는 코드
    const SearchText = hasSpecialCharcters
      ? removeSpecialCharacters(searchText)
      : searchText;
    const cachedExhibitions = await this.redisClient.get(
      `search:exhibition:${SearchText}`
    );

    if (cachedExhibitions) {
      return JSON.parse(cachedExhibitions);
    }
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
      attributes: ["exhibitionTitle"],
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
      limit: 5,
    });

    let exhibitionSearch = rows.map((row) => row.exhibitionTitle);
    if (exhibitionSearch.length === 0) {
      exhibitionSearch = null;
    }

    await this.redisClient.set(
      `search:exhibition:${SearchText}`,
      JSON.stringify(exhibitionSearch),
      "EX",
      120
    );

    return exhibitionSearch;
  };

  /**-----------
   * 유저검색
   */
  findUsers = async (searchText) => {
    const cachedUsers = await this.redisClient.get(`search:user:${searchText}`);
    if (cachedUsers || cachedUsers !== null) {
      return JSON.parse(cachedUsers);
    }

    //입력된 문자열을 문자 단위로 분해한다
    let characters = searchText.split("");

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

    // 결과를 반환하기 위해 userEmailSearch와 profileResults로 분리
    let userEmailSearch = rows.map((row) => row.userEmail);
    let profileResults = rows.map((row) => ({
      profileId: row.UserProfile.profileId,
      profileNickname: row.UserProfile.profileNickname,
      profileImg: row.UserProfile.profileImg,
    }));

    if (userEmailSearch.length === 0) {
      userEmailSearch = null;
    } else if (profileResults.length === 0) {
      profileResults = null;
    }
    const userSearch = { userEmailSearch, profileResults };

    //검색한 text를 저장해줌
    await this.redisClient.set(
      `search:user:${searchText}`,
      JSON.stringify(userSearch),
      "EX",
      3600
    );

    return [userEmailSearch, profileResults];
  };

  /**
   * 최근검색기록 TOP10
   * @locals {staring} userEmail
   * @returns
   */
  recentSearchHistory = async (userEmail) => {
    const findRecentHistory = await searchHistory.findAll({
      where: { userEmail },
      attributes: ["keyWord", "type", "createdAt"],
      limit: 10,
      order: [["createdAt", "DESC"]],
    });
    return findRecentHistory;
  };

  /**
   * 인기검색어 TOP10
   */
  searchByRank = async () => {
    const findByRank = await searchHistory.findAll({
      attributes: [
        "keyWord",
        "type",
        [Sequelize.fn("COUNT", Sequelize.col("key-word")), "count"],
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
