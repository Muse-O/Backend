const BannerRepository = require("../repositories/banner.repository");
const Boom = require("boom");

class BannerService {
  constructor() {
    this.bannerRepository = new BannerRepository();
  }

  /**
   * 현재 날짜에(한국 시간) 전시중인 전시회 중 좋아요 순 전시글
   * @param {integer} reqCnt 요청할 게시글 수
   * @returns exhibitionList
   */
  getOpenExhibitionsSortedByMostLike = async (reqCnt) => {
    
    const exhibitionList = this.bannerRepository.getOpenExhibitionsSortedByMostLike(reqCnt);

    return exhibitionList;

  }

  /**
   * 현재 날짜에(한국 시간) 전시중인 전시회 중 작성일 최근순 전시글
   * @param {integer} reqCnt 요청할 게시글 수 
   * @returns exhibitionList
   */
  getOpenExhibitionsSortedByDate = async (reqCnt) => {
    
    const exhibitionList = this.bannerRepository.getOpenExhibitionsSortedByDate(reqCnt);

    return exhibitionList;

  }

  /**
   * 예정 전시회 중 가장 가까운 날짜 전시 중 좋아요 순
   * @param {integer} reqCnt 요청할 게시글 수 
   * @returns exhibitionList
   */
  getFutureExhibitionsSortedByNearest = async (reqCnt) => {
    
    const exhibitionList = this.bannerRepository.getFutureExhibitionsSortedByNearest(reqCnt);

    return exhibitionList;

  }

  /**
   * 최근 작성된 아트그램
   * @param {integer} reqCnt 요청할 게시글 수 
   * @returns artgramList
   */
  getLatestArtgrams = async (reqCnt) => {
    
    const artgramList = this.bannerRepository.getLatestArtgrams(reqCnt);

    return artgramList;

  }

}

module.exports = BannerService;