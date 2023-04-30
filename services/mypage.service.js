const MypageRepository = require("../repositories/mypage.repository");
const Boom = require("boom");

class MypageService {
  mypageRepository = new MypageRepository();

  /**
   * 내 프로필 조회
   * @param {string} userEmail
   * @returns 프로필
   */
  getMyProfile = async (userEmail) => {
    const role = await this.mypageRepository.findUserRoleByEmail(userEmail);
    const profile = await this.mypageRepository.findProfileByEmail(userEmail);
    if (!profile) {
      throw Boom.notFound("서버 측 오류로 프로필이 존재하지 않습니다.");
    }
    const result = {
      profileImg: profile.profileImg,
      nickname: profile.profileNickname,
      introduction: profile.profileIntro,
      role: role,
    };
    return result;
  };

  /**
   * 내 프로필 수정
   * @param {string} profileImg
   * @param {string} nickname
   * @param {string} introduction
   * @param {string} userEmail
   * @returns 수정된 프로필
   */
  updateMyProfile = async (profileImg, nickname, introduction, userEmail) => {
    const profile = await this.mypageRepository.findProfileByEmail(userEmail);
    if (!profile) {
      throw Boom.notFound("서버 측 오류로 프로필이 존재하지 않습니다.");
    }
    const updatedProfile = await this.mypageRepository.updateMyProfile(
      profileImg,
      nickname,
      introduction,
      userEmail
    );
    return updatedProfile;
  };

  /**
   * 내가 작성한 전시회 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns 내가 작성한 전시회
   */
  getMyExhibition = async (limit, offset, userEmail) => {
    const exhibitions = await this.mypageRepository.findMyPostExhibition(
      limit,
      offset,
      userEmail
    );

    return exhibitions;
  };

  /**
   * 내가 좋아요한 전시회 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns 내가 좋아요한 전시회
   */
  getMyLikedExhibition = async (limit, offset, userEmail) => {
    const myLikes = await this.mypageRepository.findAllMyLikedExhibitionId(
      userEmail
    );

    if (!myLikes.length) {
      return { message: "좋아요한 게시글이 없습니다." };
    }

    const myLikedExhibitionIds = myLikes.map((elem) => elem.exhibition_id);
    const getMyLikedExhibitions = await this.mypageRepository.findMyExhibition(
      limit,
      offset,
      myLikedExhibitionIds
    );

    return getMyLikedExhibitions;
  };

  /**
   * 내가 스크랩한 전시회 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns 내가 스크랩한 전시회
   */
  getMyScrappedExhibition = async (limit, offset, userEmail) => {
    const myScraps = await this.mypageRepository.findAllMyScrappedExhibitionId(
      userEmail
    );

    if (!myScraps.length) {
      return { message: "스크랩한 게시글이 없습니다." };
    }

    const myScrappedExhibitionIds = myScraps.map((elem) => elem.exhibition_id);

    const getMyScrappedExhibitions =
      await this.mypageRepository.findMyExhibition(
        limit,
        offset,
        myScrappedExhibitionIds
      );
    return getMyScrappedExhibitions;
  };

  /**
   * 내가 작성한 아트그램 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns 내가 작성한 아트그램
   */
  getMyArtgram = async (limit, offset, userEmail) => {
    const artgrams = await this.mypageRepository.findMyPostArtgram(
      limit,
      offset,
      userEmail
    );

    return artgrams;
  };

  /**
   * 내가 좋아요한 아트그램 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns 내가 좋아요한 아트그램
   */
  getMyLikedArtgram = async (limit, offset, userEmail) => {
    const myLikes = await this.mypageRepository.findAllMyLikedArtgramId(
      userEmail
    );

    if (!myLikes.length) {
      return { message: "좋아요한 게시글이 없습니다." };
    }

    const myLikedArtgramIds = myLikes.map((elem) => elem.artgram_id);
    const getMyLikedExhibitions = await this.mypageRepository.findMyArtgram(
      limit,
      offset,
      myLikedArtgramIds
    );

    return getMyLikedExhibitions;
  };

  /**
   * 내가 스크랩한 아트그램 조회
   * @param {number} limit
   * @param {number} offset
   * @param {string} userEmail
   * @returns 내가 스크랩한 아트그램
   */
  getMyScrappedArtgram = async (limit, offset, userEmail) => {
    const myScraps = await this.mypageRepository.findAllMyScrappedArtgramId(
      userEmail
    );

    if (!myScraps.length) {
      return { message: "스크랩한 게시글이 없습니다." };
    }

    const myScrappedArtgramIds = myScraps.map((elem) => elem.artgram_id);
    const getMyScrappedArtgrams = await this.mypageRepository.findMyArtgram(
      limit,
      offset,
      myScrappedArtgramIds
    );

    return getMyScrappedArtgrams;
  };
}

module.exports = MypageService;
