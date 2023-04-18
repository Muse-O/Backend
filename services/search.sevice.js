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
   * @param {query} keyWord
   * @returns
   */
  search = async (keyWord) => {
    const artgramTitles = await this.searchRepositroy.searchArtgrams(keyWord);
    const exhibitionTitles = await this.searchRepositroy.searchExhibition(
      keyWord
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
    console.log(title);
    const saveResult = this.searchRepositroy.selectResult(title, type);
    return saveResult;
  };

  /**
   * 검색어 자동완성
   * @param {query} keyWord
   * @returns
   */
  autocomplete = async (searchText) => {
    const artgramSuggestions = await this.searchRepositroy.autocompleteArtgrams(
      searchText
    );
    const exhibitionSuggestions =
      await this.searchRepositroy.autocompleteExhibition(searchText);

    return {
      artgramTitles: artgramSuggestions,
      exhibitionTitles: exhibitionSuggestions,
    };
  };

  /**
   * 최근검색기록
   * @returns
   */
  recentSearchHistory = async () => {
    const findHistory = await this.searchRepositroy.recentSearchHistory();
    return findHistory;
  };

  /**
   * 메뉴별 검색구분
   * @param {} searchTerm
   * @returns
   */
  searchByType = async (category, keyWord) => {
    let findByCategory;
    if (category === "artgram") {
      findByCategory = await this.searchRepositroy.searchArtgrams(keyWord);
    } else if (category === "exhibition") {
      findByCategory = await this.searchRepositroy.searchExhibition(keyWord);
    }

    return findByCategory;
  };

  /**
   * 연관 검색어 기능
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
