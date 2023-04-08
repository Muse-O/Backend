const ArtgramRepository = require("../repositories/artgram.repository");
const Boom = require("boom");

class ArtgramService {
  constructor() {
    this.artgramRepository = new ArtgramRepository();
  }

  /**
   * 아트그램 전체조회
   * @param {number} limit 요청할 아트그램 게시글 수
   * @param {number} offset 조회 아트그램 게시글 시작점
   * @returns artgrams
   */
  allArtgrams = async (limit, offset) => {
    const artgrams = await this.artgramRepository.allArtgrams(limit, offset);
    if (!artgrams.artgramList) {
      throw Boom.notFound("아트그램 정보가 더이상 없습니다.");
    }
    return artgrams;
  };
  /**
   * 아트그램 작성
   * @param {string} userEmail 유저이메일
   * @param {artgramSchema} validatedData 검증된 아트그램객체{ artgramTitle, artgramDesc, imgUrl }
   * @returns 작성 결과
   */
  postArtgram = async (userEmail, validatedData) => {
    const { artgramTitle, artgramDesc, imgUrl } = validatedData;
    const postartgram = await this.artgramRepository.postArtgram(
      userEmail,
      artgramTitle,
      artgramDesc,
      imgUrl
    );
    return postartgram;
  };
  /**
   * 아트그램 수정
   * @param {string} artgramId
   * @param {artgramSchema} artgramReq
   * @returns 수정결과반환
   */
  modifyArtgram = async (artgramId, artgramReq) => {
    const { artgramTitle, artgramDesc } = artgramReq;

    const patchartgram = await this.artgramRepository.modifyArtgram(
      artgramId,
      artgramTitle,
      artgramDesc
    );
    if (patchartgram[0] === 0) {
      throw Boom.notFound(
        "게시글 삭제에 실패했습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
      );
    }
    return patchartgram;
  };

  /**
   * 아트그램 삭제
   * @param {string} artgramId
   * @returns 삭제결과반환
   */
  removeArtgram = async (artgramId) => {
    const deleteartgram = await this.artgramRepository.removeArtgram(artgramId);
    if (deleteartgram[0] === 0) {
      throw Boom.notFound(
        "게시글 삭제에 실패했습니다. 해당 게시글이 존재하지 않거나 권한이 없습니다."
      );
    }
    return deleteartgram;
  };

  /**
   * 아트그램 좋아요등록/취소
   * @param {string} artgramId
   * @param {string} userEmail
   * @returns 좋아요등록/취소결과
   */
  likeArtgram = async (artgramId, userEmail) => {
    const likeartgram = await this.artgramRepository.likeArtgram(
      artgramId,
      userEmail
    );
    return likeartgram;
  };

  /**
   * 아트그램 스크랩등록/취소
   * @param {string} artgramId
   * @param {string} userEmail
   * @returns
   */
  scrapArtgram = async (artgramId, userEmail) => {
    const scrapartgram = await this.artgramRepository.scrapArtgram(
      artgramId,
      userEmail
    );
    return scrapartgram;
  };
}

module.exports = ArtgramService;
