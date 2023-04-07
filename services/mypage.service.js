const MypageRepository = require('../repositories/mypage.repository');
const Boom = require("boom");

class MypageService {
    mypageRepository = new MypageRepository();

    getMyProfile = async (userEmail) => {
        const profile = await this.mypageRepository.findProfileByEmail(userEmail);
        if (!profile){
            throw Boom.notFound("서버 측 오류로 프로필이 존재하지 않습니다.");
        }
        return profile;
    }

    updateMyProfile = async (profileImg, nickname, introduction, userEmail) => {
        const profile = await this.mypageRepository.findProfileByEmail(userEmail);
        if (!profile){
            throw Boom.notFound("서버 측 오류로 프로필이 존재하지 않습니다.");
        }
        await this.mypageRepository.updateMyProfile(profileImg, nickname, introduction, userEmail);
    }
}

module.exports = MypageService;