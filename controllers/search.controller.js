const { find } = require("lodash");
const SearchService = require("../services/search.sevice");

class SearchContorller {
  constructor() {
    this.searchService = new SearchService();
  }
  /**
   * 검색
   * @param {query} keyWord
   * @return
   */
  search = async (req, res, next) => {
    try {
      const { keyWord } = req.query;
      const searchText = await this.searchService.search(keyWord);
      res.status(200).json({ keyWord: searchText });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 전시회 검색기록저장
   */
  selectResult = async (req, res, next) => {
    try {
      const { keyWord, type } = req.body;
      const selectKeyword = await this.searchService.selectResult(
        keyWord,
        type
      );
      res
        .status(200)
        .json({ selectKeyword, message: "검색기록저장되었습니다" });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 자동완성
   * @param {query} keyWord
   * @return
   */
  autocomplete = async (req, res, next) => {
    try {
      const { keyWord } = req.query;
      const autoSearch = await this.searchService.autocomplete(keyWord);
      res.status(200).json({ autoSearch });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 최근검색기록
   */
  recentSearchHistory = async (req, res, next) => {
    try {
      const findHistory = await this.searchService.recentSearchHistory();
      res.status(200).json({ recentHistory: findHistory });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 메뉴별 검색 구분기능
   */
  searchByType = async (req, res, next) => {
    try {
      const { category, keyWord } = req.query;
      const categorySearch = await this.searchService.searchByType(
        category,
        keyWord
      );
      res.status(200).json({ categorySearch });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 연관 검색어 기능
   */
  searchTerms = async (req, res, next) => {
    // try {
    const { searchTerm } = req.query;
    const relatedSearchTerms = await this.searchService.searchTerms(searchTerm);
    res.status(200).json({ relatedSearchTerms });
    // } catch (err) {
    //   next(err);
    // }
  };
}

module.exports = SearchContorller;
