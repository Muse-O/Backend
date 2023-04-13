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
    const { keyWord } = req.query;
    const searchText = await this.searchService.search(keyWord);
    res.status(200).json({ keyWord: searchText });
  };

  /**
   * 전시회 검색기록저장
   */
  selectExhibition = async (req, res, next) => {};

  /**
   * 자동완성
   * @param {query} keyWord
   * @return
   */
  autocomplete = async (req, res, next) => {
    const { keyWord } = req.query;
    const autoSearch = await this.searchService.autocomplete(keyWord);
    res.status(200).json({ autoSearch });
  };
}

module.exports = SearchContorller;
