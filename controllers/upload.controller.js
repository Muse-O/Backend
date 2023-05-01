
// router.get("/exhibition/postimage", authMiddleware, uploadController.getExhibitionPostImageUploadUrl);
// // 전시회 상세 사진
// router.get("/exhibition/artimage", authMiddleware, uploadController.getExhibitionArtImageUploadUrl);
// // 프로필 사진
// router.get("/profile/userimage", authMiddleware, uploadController.getProfileUserImageUploadUrl);
// // 아트그램 사진
// router.post("/artgram/image", authMiddleware, uploadController.getArtgramImageUploadUrl);
// // 채팅 업로드 URL
// router.get("/chat/image", authMiddleware, uploadController.getChatImageUploadUrl);
const axios = require("axios");
require("dotenv").config();

const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`;
const token = `${process.env.CLOUDFLARE_API_KEY}`;

// CLOUDFLARE_ACCOUNT_ID=b145a7d17d0cca83dce09f90b0265908
// CLOUDFLARE_API_KEY=7DM6tVajxmN4HrmbQjG7UqdFghmSvqXg

class UploadController {
  /**
   * 전시회 포스트 이미지
   */
  getImageUploadUrl = async (req, res, next) => {

    const { reqCnt = 1 } = req.query;

    try {
      const requests = Array.from({ length: reqCnt }, () =>
        axios(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
  
      const responses = await Promise.all(requests);
      const data = responses.map((response) => response.data);
  
      res.json({
        urlData: data,
        message: "정상적으로 이미지 업로드 URL을 조회했습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UploadController;