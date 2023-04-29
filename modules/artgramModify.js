const { ArtgramHashtag, ArtgramImg } = require("../models");
const Boom = require("boom");

artgramModify = async (artgramId, imgUrlArray, hashtag) => {
  try {
    // 1. 기존 해시태그 가져오기
    const existingHashtags = await ArtgramHashtag.findAll({
      where: { artgramId },
    });
    if (hashtag) {
      if (Array.isArray(hashtag)) {
        // ... 이전 코드와 동일 ...
      } else {
        for (let existingHashtag of existingHashtags) {
          if (existingHashtag.tagName === hashtag) {
            // 해시태그가 이미 존재하면 업데이트
            await ArtgramHashtag.update(
              { tagName: hashtag },
              { where: { artgramTagId: existingHashtag.artgramTagId } }
            );
          } else {
            // 새 해시태그에 없는 경우 삭제
            await ArtgramHashtag.destroy({
              where: { artgramTagId: existingHashtag.artgramTagId },
            });
          }
        }
      }
    } else {
      return;
    }
  } catch {
    await this.rollback();
    throw Boom.badRequest("해시태그수정에 실패했습니다.");
  }

  try {
    // 1. 기존 이미지 가져오기
    const existingImgs = await ArtgramImg.findAll({
      where: { artgramId },
    });
    if (Array.isArray(imgUrlArray)) {
      // 2. 새 이미지를 기준으로 추가 및 업데이트 수행
      let imgOrder = 1;
      for (let newImg of imgUrlArray) {
        const existingImg = existingImgs.find((h) => h.tagName === newImg);

        if (existingImg) {
          // 이미지가 이미 존재하면 업데이트
          await ArtgramImg.update(
            { imgUrl: newImg, imgOrder },
            { where: { artgramImgId: existingImg.artgramImgId } }
          );
        } else {
          // 이미지가 존재하지 않으면 추가
          await ArtgramImg.create({ imgOrder, imgUrl: newImg, artgramId });
        }
        imgOrder++; // imgOrder 속성 값 증가
      }

      // 3. 기존 이미지를 기준으로 삭제 수행
      for (let existingImg of existingImgs) {
        if (!imgUrlArray.includes(existingImg.tagName)) {
          // 새 이미지에 없는 경우 삭제
          await ArtgramImg.destroy({
            where: { artgramImgId: existingImg.artgramImgId },
          });
        }
      }
    }
  } catch {
    await t.rollback();
    throw Boom.badRequest("이미지 수정에 실패했습니다.");
  }
};

module.exports = artgramModify;
