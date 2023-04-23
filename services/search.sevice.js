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
  search = async (result) => {
    const { searchText } = result.value;
    const artgramTitles = await this.searchRepositroy.autocompleteArtgrams(
      searchText
    );
    const exhibitionTitles = await this.searchRepositroy.autocompleteExhibition(
      searchText
    );
    const findUser = await this.searchRepositroy.findUsers(searchText);

    return {
      artgramTitles: artgramTitles,
      exhibitionTitles: exhibitionTitles,
      findUsers: findUser,
    };
  };

  /**
   * 전시회 검색기록저장
   * @param {query} title
   */
  selectResult = async (title, type, userEmail) => {
    let saveResult;
    if (userEmail !== "guest" && userEmail !== undefined) {
      saveResult = this.searchRepositroy.selectResult(title, type);
    } else {
      saveResult = this.searchRepositroy.selectResult(title, type, userEmail);
    }
    return saveResult;
  };

  /**
   * 최근검색기록 TOP10
   * @returns
   */
  recentSearchHistory = async (userEmail) => {
    let findHistory;
    if (userEmail !== "guest" && userEmail !== undefined) {
      findHistory = this.searchRepositroy.recentSearchHistory(userEmail);
    } else {
      findHistory = this.searchRepositroy.recentSearchHistory(userEmail);
    }
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
  searchByType = async (result) => {
    const { category, searchText } = result.value;
    let findByCategory;
    if (category === "artgram") {
      findByCategory = await this.searchRepositroy.autocompleteArtgrams(
        searchText
      );
    } else if (category === "exhibition") {
      findByCategory = await this.searchRepositroy.autocompleteExhibition(
        searchText
      );
    } else if (category === "user") {
      findByCategory = await this.searchRepositroy.findUsers(searchText);
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
