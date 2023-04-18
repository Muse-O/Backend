const { searchHistory, Artgrams, Exhibitions } = require("../models");
const { Sequelize, Op } = require("sequelize");
const RedisClient = require("../config/redisConnector");
const client = require("../config/elasticSearch-Connector");
const {
  createFuzzyMatcherKor,
  ch2pattern,
  isKorean,
} = require("../schemas/searchForInitialKor");

class SearchRepositroy extends searchHistory {
  constructor() {
    super();
    this.redisClient = RedisClient.getClient();
  }
  /**
   * 아트그램 검색어 조회
   * @param {query} keyWord
   * @returns
   */
  searchArtgrams = async (keyWord) => {
    const cachedArtgramTitles = await this.redisClient.get(
      `search:artgram:${keyWord}`
    );

    if (cachedArtgramTitles) {
      return JSON.parse(cachedArtgramTitles);
    }

    const rows = await Artgrams.findAll({
      attributes: ["artgramTitle"],
      where: {
        [Sequelize.Op.or]: [
          { artgramTitle: { [Sequelize.Op.like]: `%${keyWord}%` } },
          { artgramDesc: { [Sequelize.Op.like]: `%${keyWord}%` } },
        ],
      },
    });

    const artgramTitles = rows.map((row) => row.artgramTitle);
    await this.redisClient.set(
      `search:artgram:${keyWord}`,
      JSON.stringify(artgramTitles),
      "EX",
      3600
    );

    return artgramTitles;
  };

  /**
   * 전시회 검색어 조회
   * @param {query} searchText
   * @returns
   */
  searchExhibition = async (searchText) => {
    const cachedExhibitionTitles = await this.redisClient.get(
      `search:exhibition:${searchText}`
    );

    if (cachedExhibitionTitles) {
      return JSON.parse(cachedExhibitionTitles);
    }

    const rows = await Exhibitions.findAll({
      attributes: ["exhibitionTitle"],
      where: {
        [Sequelize.Op.or]: [
          { exhibitionTitle: { [Sequelize.Op.like]: `%${searchText}%` } },
          { exhibitionDesc: { [Sequelize.Op.like]: `%${searchText}%` } },
        ],
      },
    });

    const exhibitionTitles = rows.map((row) => row.exhibitionTitle);
    await this.redisClient.set(
      `search:exhibition:${searchText}`,
      JSON.stringify(exhibitionTitles),
      "EX",
      3600
    );

    return exhibitionTitles;
  };

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
   * 아트그램 자동완성
   * @param {query} searchText
   * @returns
   */
  autocompleteArtgrams = async (searchText) => {
    const characters = searchText.split("");

    const koreanChars = characters.filter(isKorean);
    const otherChars = characters.filter((char) => !isKorean(char));

    let chosungText = "";
    if (koreanChars.length > 0) {
      chosungText = createFuzzyMatcherKor(koreanChars.join(""));
    }

    const otherCharsText = otherChars.join("");
    const rows = await Artgrams.findAll({
      attributes: ["artgramTitle"],
      where: {
        [Sequelize.Op.and]: [
          {
            artgramTitle: {
              [Sequelize.Op.like]: `%${otherCharsText}%`,
            },
          },
          chosungText
            ? {
                artgramTitle: {
                  [Sequelize.Op.regexp]: chosungText,
                },
              }
            : null,
        ].filter(Boolean),
      },
      limit: 5,
    });
    return rows.map((row) => row.artgramTitle);
  };

  /**
   * 전시회 자동완성
   * @param {query} searchText
   * @returns
   */
  autocompleteExhibition = async (searchText) => {
    const characters = searchText.split("");

    const koreanChars = characters.filter(isKorean);
    const otherChars = characters.filter((char) => !isKorean(char));

    let chosungText = "";
    if (koreanChars.length > 0) {
      chosungText = createFuzzyMatcherKor(koreanChars.join(""));
    }

    const otherCharsText = otherChars.join("");
    const rows = await Exhibitions.findAll({
      attributes: ["exhibitionTitle"],
      where: {
        [Sequelize.Op.and]: [
          {
            exhibitionTitle: {
              [Sequelize.Op.like]: `%${otherCharsText}%`,
            },
          },
          chosungText
            ? {
                exhibitionTitle: {
                  [Sequelize.Op.regexp]: chosungText,
                },
              }
            : null,
        ].filter(Boolean),
      },
      limit: 5,
    });
    return rows.map((row) => row.exhibitionTitle);
  };

  /**
   * 최근검색기록
   */
  recentSearchHistory = async () => {
    const findRecentHistory = await searchHistory.findAll({
      attributes: ["keyWord", "type", "createdAt"],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    return findRecentHistory;
  };

  /**
   * 연관 검색어 기능
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
