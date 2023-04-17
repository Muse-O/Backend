const { searchHistory, Artgrams, Exhibitions } = require("../models");
const { Sequelize, Op } = require("sequelize");
const RedisClient = require("../config/redisConnector");
// const {
//   RedisElasticsearchConnector,
// } = require("../config/elasticSearch-redisConnector");
// const redisElasticsearchConnectorInstance = new RedisElasticsearchConnector();

class SearchRepositroy extends searchHistory {
  constructor() {
    super();
    this.redisClient = RedisClient.getClient();
    // this.connector = redisElasticsearchConnectorInstance;
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
   * @param {query} keyWord
   * @param {query} type
   * @returns
   */
  selectResult = async (keyWord, type) => {
    const savedResult = await searchHistory.create({
      keyWord: keyWord,
      type: type,
    });
    return savedResult;
  };

  /**
   * 아트그램 자동완성
   * @param {query} searchText
   * @returns
   */
  async autocompleteArtgrams(searchText) {
    const rows = await Artgrams.findAll({
      attributes: ["artgramTitle"],
      where: { artgramTitle: { [Sequelize.Op.like]: `%${searchText}%` } },
      limit: 5, // Limit the number of results
    });
    return rows.map((row) => row.artgramTitle);
  }

  /**
   * 전시회 자동완성
   * @param {query} searchText
   * @returns
   */
  async autocompleteExhibitions(searchText) {
    const rows = await Exhibitions.findAll({
      attributes: ["exhibitionTitle"],
      where: { exhibitionTitle: { [Sequelize.Op.like]: `%${searchText}%` } },
      limit: 5, // Limit the number of results
    });
    return rows.map((row) => row.exhibitionTitle);
  }

  /**
   * 최근검색기록
   */
  recentSearchHistory = async () => {
    const findRecentHistory = await searchHistory.findAll({
      attributes: ["keyWord", "type"],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    return findRecentHistory;
  };

  /**
   * 연관 검색어 기능
   */
  async searchTerms(searchTerm) {
    const { body } = await this.connector.esClient.search({
      index: "your-index-name",
      body: {
        query: {
          match: {
            fieldName: searchTerm,
          },
        },
      },
    });

    const relatedSearchTerms = body.hits.hits.map(
      (hit) => hit._source.fieldName
    );
    return relatedSearchTerms;
  }
}

module.exports = SearchRepositroy;
