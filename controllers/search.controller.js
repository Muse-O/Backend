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
    // try {
    const { searchText } = req.query;
    const search = await this.searchService.search(searchText);
    res.status(200).json({ searchText: search });
    // } catch (err) {
    //   next(err);
    // }
  };

  /**
   * 전시회 검색기록저장
   */
  selectResult = async (req, res, next) => {
    try {
      const { title, type } = req.body;
      const { userEmail } = res.locals.user || "guest";
      const selectKeyword = await this.searchService.selectResult(
        title,
        type,
        userEmail
      );
      res
        .status(200)
        .json({ selectKeyword, message: "검색기록저장되었습니다" });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 최근검색기록
   */
  recentSearchHistory = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user || "guest";
      const findHistory = await this.searchService.recentSearchHistory(
        userEmail
      );
      res.status(200).json({ recentHistory: findHistory });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 인기순 TOP10
   */
  searchByRank = async (req, res, next) => {
    try {
      const searchRank = await this.searchService.searchByRank();
      res.status(200).json({ searchRank });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 메뉴별 검색 구분기능
   */
  searchByType = async (req, res, next) => {
    try {
      const { category, searchText } = req.query;
      const categorySearch = await this.searchService.searchByType(
        category,
        searchText
      );
      res.status(200).json({ search: [category, categorySearch] });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 연관 검색어 기능
   */
  // searchTerms = async (req, res, next) => {
  // try {
  // const { searchTerm } = req.query;
  // const relatedSearchTerms = await this.searchService.searchTerms(searchTerm);
  // res.status(200).json({ relatedSearchTerms });
  // } catch (err) {
  //   next(err);
  // }
  // };
}

module.exports = SearchContorller;
