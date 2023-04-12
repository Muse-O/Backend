const SearchRepositroy = require("../repositories/search.repository");
// const Redis = require("ioredis");
// const redisClient = new Redis({
//   host: "ec2-43-201-154-28.ap-northeast-2.compute.amazonaws.com",
//   port: 6379,
// });
const RedisConnector = require("../config/redisConnector");

class SearchService {
  constructor() {
    this.searchRepositroy = new SearchRepositroy();
    this.redisClient = RedisConnector.getClient();
  }
  /**
   * 검색기능
   * @param {query} keyWord
   * @returns
   */
  search = async (keyWord) => {
    //redis 캐시에서 검색 결과 확인
    const cachedArtgramTitles = await this.redisClient.get(
      `search:artgram:${keyWord}`
    );
    const cachedExhibitionTitles = await this.redisClient.get(
      `search:exhibition:${keyWord}`
    );

    let artgramTitles, exhibitionTitles;

    if (cachedArtgramTitles) {
      //캐시된 경우 결과를 파싱하고 반환
      artgramTitles = JSON.parse(cachedArtgramTitles);
    } else {
      //캐시되지 않은 경우 Artgrams테이블에서 해당 값을 가져오기
      artgramTitles = await this.searchRepositroy.searchArtgrams(keyWord);
      artgramTitles = artgramTitles.map((row) => row.artgramTitle);
      //다음에 검색할땐 빠르게 검색하기 위해 redis에 제목을 캐시
      await this.redisClient.set(
        `search:artgram:${keyWord}`,
        JSON.stringify(artgramTitles),
        "EX",
        3600
      );
    }

    if (cachedExhibitionTitles) {
      //캐시된 경우 결과를 파싱하고 반환
      exhibitionTitles = JSON.parse(cachedExhibitionTitles);
    } else {
      //캐시되지 않은 경우 Exhibitions테이블에서 해당 값을 가져오기
      exhibitionTitles = await this.searchRepositroy.searchExhibition(keyWord);
      exhibitionTitles = exhibitionTitles.map((row) => row.exhibitionTitle);
      //다음에 검색할땐 빠르게 검색하기 위해 redis에 제목을 캐시
      await this.redisClient.set(
        `search:${keyWord}`,
        JSON.stringify(exhibitionTitles),
        "EX",
        3600
      );
    }

    return {
      artgramTitles: artgramTitles,
      exhibitionTitles: exhibitionTitles,
    };
  };

  /**
   * 검색어 자동완성
   * @param {query} keyWord
   * @returns
   */
  autocomplete = async (keyWord) => {
    const artgramSuggestions = await this.searchRepositroy.autocompleteArtgrams(
      keyWord
    );
    const exhibitionSuggestions =
      await this.searchRepositroy.autocompleteExhibition(keyWord);

    return {
      artgramTitles: artgramSuggestions,
      exhibitionTitles: exhibitionSuggestions,
    };
  };
}

module.exports = SearchService;
