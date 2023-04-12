const { searchHistory, Artgrams, Exhibitions } = require("../models");
const { Sequelize, Op } = require("sequelize");

class SearchRepositroy extends searchHistory {
  constructor() {
    super();
  }
  /**
   * 아트그램 검색어 조회
   * @param {query} keyWord
   * @returns
   */
  searchArtgrams = async (keyWord) => {
    const rows = await Artgrams.findAll({
      attributes: ["artgramTitle"],
      where: {
        [Sequelize.Op.or]: [
          { artgramTitle: { [Sequelize.Op.like]: `%${keyWord}%` } },
          { artgramDesc: { [Sequelize.Op.like]: `%${keyWord}%` } },
        ],
      },
    });
    return rows;
  };

  /**
   * 전시회 검색어 조회
   * @param {query} searchText
   * @returns
   */
  searchExhibition = async (searchText) => {
    const rows = await Exhibitions.findAll({
      attributes: ["exhibitionTitle"],
      where: {
        [Sequelize.Op.or]: [
          { exhibitionTitle: { [Sequelize.Op.like]: `%${searchText}%` } },
          { exhibitionDesc: { [Sequelize.Op.like]: `%${searchText}%` } },
        ],
      },
    });
    return rows;
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
}

module.exports = SearchRepositroy;
