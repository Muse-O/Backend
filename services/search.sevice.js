const SearchRepositroy = require("../repositories/search.repository");
const RedisElasticsearchConnector = require("../config/redisConnector");

class SearchService {
  constructor() {
    this.searchRepositroy = new SearchRepositroy();
    this.redisElasticsearchConnector = RedisElasticsearchConnector.getClient();
    this.redisClient = this.redisElasticsearchConnector.redis;
  }
  /**
   * 검색기능
   * @param {query} searchText
   * @returns
   */
  search = async (searchText) => {
    console.log("searchText", searchText);
    const artgramTitles = await this.searchRepositroy.autocompleteArtgrams(
      searchText
    );
    const exhibitionTitles = await this.searchRepositroy.autocompleteExhibition(
      searchText
    );

    return {
      artgramTitles: artgramTitles,
      exhibitionTitles: exhibitionTitles,
    };
  };

  /**
   * 전시회 검색기록저장
   * @param {query} title
   */
  selectResult = async (title, type) => {
    const saveResult = this.searchRepositroy.selectResult(title, type);
    return saveResult;
  };

  /**
   * 최근검색기록 TOP10
   * @returns
   */
  recentSearchHistory = async () => {
    const findHistory = await this.searchRepositroy.recentSearchHistory();
    return findHistory;
  };

  /**
   * 인기검색어 TOP10
   */
  searchByRank = async () => {
    const rank = await this.searchRepositroy.searchByRank();
    return rank;
  };

  /**
   * 메뉴별 검색구분
   * @param {}
   * @returns
   */
  searchByType = async (category, searchText) => {
    let findByCategory;
    if (category === "artgram") {
      findByCategory = await this.searchRepositroy.autocompleteArtgrams(
        searchText
      );
    } else if (category === "exhibition") {
      findByCategory = await this.searchRepositroy.autocompleteExhibition(
        searchText
      );
    }

    return findByCategory;
  };

  /**
   * 연관 검색어 기능(미구현)
   *
   */
  searchTerms = async (searchTerm) => {
    const relatedSearchTerms = await this.searchRepositroy.searchTerms(
      searchTerm
    );
    return relatedSearchTerms;
  };
}

module.exports = SearchService;
