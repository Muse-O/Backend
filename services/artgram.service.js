const ArtgramRepository = require("../repositories/artgram.repository");
const Boom = require("boom");
const NotiRepository = require("../repositories/notification.repository");

class ArtgramService {
  constructor() {
    this.artgramRepository = new ArtgramRepository();
    this.notiRepository = new NotiRepository();
  }

  /**
   * 아트그램 전체조회(로그인유무검증)
   * @param {number} limit 요청할 아트그램 게시글 수
   * @param {number} offset 조회 아트그램 게시글 시작점
   * @param {Locals.user} userEmail 현재 로그인한 유저의 이메일
   * @returns findAllArtgrams db에서 조회해온 값
   */
  loadAllArtgrams = async (limit, offset, userEmail) => {
    let findAllArtgrams;
    if (userEmail !== "guest" && userEmail !== undefined) {
      // user 객체가 존재하고 userEmail 속성이 존재하는 경우

      findAllArtgrams = await this.artgramRepository.getAllArtgram(
        limit,
        offset,
        userEmail
      );
    } else {
      // user 객체가 존재하지 않거나 userEmail 속성이 존재하지 않는 경우

      findAllArtgrams = await this.artgramRepository.getPublicAllArtgram(
        limit,
        offset
      );
    }
    return findAllArtgrams;
  };

  /**
   * 아트그램 상세조회(로그인유무검증)
   * @param {params} artgramId 조회 아트그램 게시글 시작점
   * @param {Locals.user} userEmail 현재 로그인한 유저의 이메일
   * @returns findAllArtgrams db에서 조회해온 값
   * @returns detailartgram db에서 가져온 데이터반환
   */
  loadDetailArtgram = async (artgramId, userEmail) => {
    let detailartgram;
    if (userEmail !== "guest" && userEmail !== undefined) {
      detailartgram = await this.artgramRepository.loadDetailArtgram(
        artgramId,
        userEmail
      );
    } else {
      detailartgram = await this.artgramRepository.loadPublicDetailArtgram(
        artgramId
      );
    }

    return detailartgram;
  };

  /**
   * 아트그램 작성
   * @param {string} userEmail 유저이메일
   * @param {artgramSchema} validatedData 검증된 아트그램객체{ artgramTitle, artgramDesc, imgUrl }
   * @returns 작성 결과
   */

  creatingAnArtgram = async (userEmail, validatedData) => {
    const { artgramTitle, artgramDesc, hashtag, imgUrl } = validatedData;
    const postartgram = await this.artgramRepository.creatingAnArtgram(
      userEmail,
      artgramTitle,
      artgramDesc,
      imgUrl,
      hashtag
    );
    return postartgram;
  };
  /**
   * 아트그램 수정
   * @param {string} artgramId
   * @param {artgramSchema} artgramReq
   * @returns 수정결과반환
   */
  ArtgramToModify = async (artgramId, artgramReq) => {
    const { artgramTitle, artgramDesc } = artgramReq;
    const patchartgram = await this.artgramRepository.ArtgramToModify(
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
  artgramWithLike = async (artgramId, userEmail) => {
    const likeartgram = await this.artgramRepository.artgramWithLike(
      artgramId,
      userEmail
    );

    if (likeartgram == "create") {
      const noti_receiver = await this.artgramRepository.findNotiReceiver(
        artgramId
      );
      const noti_sender = await this.notiRepository.findNotiSenderProfile(
        userEmail
      );
      const notiData = {
        noti_sender: userEmail,
        noti_sender_nickname: noti_sender.profile_nickname,
        noti_type: "like",
        noti_content: "artgram",
        noti_content_id: artgramId,
      };
      await this.notiRepository.saveToStream(noti_receiver, notiData);
    }

    return likeartgram;
  };

  /**
   * 아트그램 스크랩등록/취소
   * @param {string} artgramId
   * @param {string} userEmail
   * @returns
   */
  artgramWithScrap = async (artgramId, userEmail) => {
    const scrapartgram = await this.artgramRepository.artgramWithScrap(
      artgramId,
      userEmail
    );
    return scrapartgram;
  };
}

module.exports = ArtgramService;
