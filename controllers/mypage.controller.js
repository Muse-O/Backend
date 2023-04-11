const MypageService = require("../services/mypage.service");
const logger = require("../middlewares/logger.js");
const Boom = require("boom");
const mypageSchema = require("../schemas/mypageReqSchema");

class MypageController {
    mypageService = new MypageService();

    getMyProfile = async (req, res, next) => {
        try {
            const { userEmail } = res.locals.user;
            const result = await this.mypageService.getMyProfile(userEmail);

            return res.status(200).json({
                profileImg: result.profileImg, 
                nickname: result.profileNickname, 
                introduction: result.profileIntro
            });
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }

    updateMyProfile = async (req, res, next) => {
        try {
            const { profileImg, nickname, introduction } = req.body;
            const { userEmail } = res.locals.user;
            const validate = mypageSchema.validate(req.body)
            
            if (validate.error) {
                throw Boom.badRequest(validate.error.message);
              } else {
                console.log("Valid input!");
              }

            const updatedProfile = await this.mypageService.updateMyProfile(profileImg, nickname, introduction, userEmail)
            const result = {
                profileImg: updatedProfile.profileImg, 
                nickname: updatedProfile.profileNickname, 
                introduction: updatedProfile.profileIntro
            }
            return res.status(200).json({message: "프로필 수정 성공했습니다.", result})
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }

    getMyExhibition = async (req, res, next) => {
        try {
            const { userEmail } = res.locals.user;

            const exhibitions = await this.mypageService.getMyExhibition(userEmail)

            return res.status(200).json({ myExhibitions:exhibitions })
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }

    getMyLikedExhibition = async (req, res, next) => {
        try {
            const { userEmail } = res.locals.user;

            const result = await this.mypageService.getMyLikedExhibition(userEmail)

            return res.status(200).json({ myLikedExhibitions:result })
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }

    getMyScrappedExhibition = async (req, res, next) => {
        try {
            const { userEmail } = res.locals.user;

            const result = await this.mypageService.getMyScrappedExhibition(userEmail)

            return res.status(200).json({message: "내가 스크랩한 전시회 조회에 성공했습니다.", result})
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
}

module.exports = MypageController;