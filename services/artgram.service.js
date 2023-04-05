const ArtgramRepository = require("../repositories/artgram.repository");
const Boom = require("boom");

class ArtgramService {
  constructor() {
    this.artgramRepository = new ArtgramRepository();
  }

  //아트그램 전체조회
  allArtgrams = async (limit, offset) => {
    const artgrams = await this.artgramRepository.allArtgrams(limit, offset);
    if (!artgrams.artgramList) {
      throw Boom.notFound("아트그램 정보가 더이상 없습니다.");
    }
    return artgrams;
  };

  //아트그램 작성
  postArtgram = async (
    artgramId,
    userEmail,
    artgramTitle,
    artgramDesc,
    files
  ) => {
    const imgUrl = files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));
    const postartgram = await this.artgramRepository.postArtgram(
      artgramId,
      userEmail,
      imgUrl,
      artgramTitle,
      artgramDesc
    );
    return postartgram;
  };

  //아트그램 수정
  modifyArtgram = async (artgramId, artgramTitle, artgramDesc) => {
    const patchartgram = await this.artgramRepository.modifyArtgram(
      artgramId,
      artgramTitle,
      artgramDesc
    );
    return patchartgram;
  };

  //아트그램 삭제
  removeArtgram = async (artgramId) => {
    const deleteartgram = await this.artgramRepository.removeArtgram(artgramId);
    return deleteartgram;
  };

  //아트그램 좋아요등록/취소
  likeArtgram = async (artgramId, userEmail) => {
    const likeartgram = await this.artgramRepository.likeArtgram(
      artgramId,
      userEmail
    );
    return likeartgram;
  };

  //아트그램 스크랩등록/취소
  scrapArtgram = async (artgramId, userEmail) => {
    const scrapartgram = await this.artgramRepository.scrapArtgram(
      artgramId,
      userEmail
    );
    return scrapartgram;
  };
}

module.exports = ArtgramService;
