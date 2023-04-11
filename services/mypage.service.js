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
        const updatedProfile = await this.mypageRepository.updateMyProfile(profileImg, nickname, introduction, userEmail);
        return updatedProfile;
    }

    getMyExhibition = async (userEmail) => {
        const exhibitions = await this.mypageRepository.findMyExhibition(userEmail);
        const result = exhibitions.map((elem)=>{
            return {
                exhibitionIdx: elem.exhibition_id,
                title : elem.exhibition_title,
                thumbUrl : elem.post_image
            }
        });
        return result
    };

    getMyLikedExhibition = async (userEmail) =>{
        const exhibitions = await this.mypageRepository.findMyLikedExhibition(userEmail);
        return exhibitions
    }

    getMyScrappedExhibition= async (userEmail) => {
        const exhibitions = await this.mypageRepository.findMyScrappedExhibition(userEmail);
        return exhibitions
    }
}

module.exports = MypageService;