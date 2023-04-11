const SearchService = require("../services/search.sevice");

class SearchContorller {
  constructor() {
    this.searchService = new SearchService();
  }
  /**
   * 검색
   * @param {query} searchText
   * @return
   */
  search = async (req, res, next) => {
    const { searchText } = req.query;
    const searchtext = await this.searchService.search(searchText);
    res.status(200).json({ searchtext });
  };

  /**
   * 자동완성
   * @param {query} searchText
   * @return
   */
  autocomplete = async (req, res, next) => {
    const { searchText } = req.query;
    const autoSearch = await this.searchService.autocomplete(searchText);
    res.status(200).json({ autoSearch });
  };
}

module.exports = SearchContorller;
