const SearchRepositroy = require("../repositories/search.repository");
const RedisElasticsearchConnector = require("../config/redisConnector");
const Boom = require("boom");

class SearchService {
  constructor() {
    this.searchRepositroy = new SearchRepositroy();
    this.redisElasticsearchConnector = RedisElasticsearchConnector.getClient();
    this.redisClient = this.redisElasticsearchConnector.redis;
  }
  /**
   * 검색기능
   * @param {validator} result
   * @returns
   */
  search = async (result, userEmail) => {
    const searchText = result.value;
    if (!searchText) {
      return Boom.notFound("검색어가 존재하지 않습니다.");
    }
    const artgrams = await this.searchRepositroy.autocompleteArtgrams(
      searchText,
      userEmail
    );
    const exhibitions = await this.searchRepositroy.autocompleteExhibition(
      searchText,
      userEmail
    );
    const users = await this.searchRepositroy.findUsers(searchText, userEmail);

    return {
      artgrams,
      exhibitions,
      users,
    };
  };

  /**
   * 전시회 검색기록저장
   * @param {validator} result
   * @param {Locals.user} userEmail
   */
  selectResult = async (result, userEmail) => {
    const { title, type } = result.value;

    let saveResult;
    if (userEmail !== "guest" && userEmail !== undefined) {
      saveResult = this.searchRepositroy.selectResult(title, type, userEmail);
    } else {
      throw Boom.notFound("유저정보가 없으면 저장할 수 없습니다.");
    }
    return saveResult;
  };

  /**
   * 최근검색기록 TOP10
   * @param {Locals.user} userEmail
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
   * @param {validator} result
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
