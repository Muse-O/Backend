const { searchHistory, Artgrams, Exhibitions } = require("../models");
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
} = require("../schemas/searchForInitialKor");

class SearchRepositroy extends searchHistory {
  constructor() {
    super();
    this.redisClient = RedisClient.getClient();
  }
  /**
   * 유저가 검색후 선택한 게시글저장
   * @param {query} title
   * @param {query} type
   * @returns
   */
  selectResult = async (title, type) => {
    const savedResult = await searchHistory.create({
      keyWord: title,
      type: type,
    });
    return savedResult;
  };

  /**
   * 아트그램 검색
   * @param {query} searchText
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
    console.log("searchText", SearchText);
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

    //데이터베이스에서 값을 찾아옴(두 값이 동일하지 않을수 있기때문에 Op.or을 사용)
    const rows = await Artgrams.findAll({
      attributes: ["artgramTitle"],
      where: {
        [Sequelize.Op.or]: [
          { artgramTitle: { [Sequelize.Op.and]: titleConditions } },
          { artgramDesc: { [Sequelize.Op.and]: descConditions } },
        ],
      },
      limit: 5,
    });

    //map을 사용해서 값이 일치하는 artgramTitle만 가져옴
    let artgramSearch = rows.map((row) => row.artgramTitle);
    if (artgramSearch.length === 0) {
      artgramSearch = null;
    }
    //검색한 text를 저장해줌
    await this.redisClient.set(
      `search:artgram:${SearchText}`,
      JSON.stringify(artgramSearch),
      "EX",
      3600
    );

    return artgramSearch;
  };

  /**
   * 전시회 검색
   * @param {query} searchText
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
      3600
    );

    return exhibitionSearch;
  };

  /**
   * 최근검색기록 TOP10
   */
  recentSearchHistory = async () => {
    const findRecentHistory = await searchHistory.findAll({
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
  searchTerms = async (searchTerm) => {
    const rows = await Artgrams.findAll({
      attributes: ["artgram_title", "artgram_desc"],
      where: Sequelize.literal(
        `MATCH(artgram_title, artgram_desc) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)`
      ),
      replacements: { searchTerm },
    }).concat(
      await Exhibitions.findAll({
        attributes: ["exhibition_title", "exhibition_desc"],
        where: Sequelize.literal(
          `MATCH(exhibition_title, exhibition_desc) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)`
        ),
        replacements: { searchTerm },
      })
    );

    const relatedSearchTerms = rows.map(
      (row) =>
        row.artgram_title + " " + row.artgram_desc ||
        row.exhibition_title + " " + row.exhibition_desc
    );

    const results = await client.search({
      index: "your_elasticsearch_index_name",
      body: {
        query: {
          match: {
            your_elasticsearch_field_name: relatedSearchTerms.join(" "),
          },
        },
      },
    });

    const hits = results.hits.hits;
    const relatedSearchTermsInElasticsearch = hits.map(
      (hit) => hit._source.your_elasticsearch_field_name
    );
    return relatedSearchTermsInElasticsearch;
  };
}

module.exports = SearchRepositroy;
