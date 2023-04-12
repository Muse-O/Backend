const MypageRepository = require('../repositories/mypage.repository');
const Boom = require("boom");
const { use } = require('passport');

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
        const exhibitions = await this.mypageRepository.findMyPostExhibition(userEmail);
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
        const myLikes = await this.mypageRepository.findAllMyLikedExhibitionId(userEmail);
        const myLikedExhibitionIds = myLikes.map((elem)=>elem.exhibition_id);
        const getMyLikedExhibitions = await this.mypageRepository.findMyExhibition(myLikedExhibitionIds)
        const result = getMyLikedExhibitions.map((elem)=>{
            return {
                exhibitionIdx: elem.exhibition_id,
                title : elem.exhibition_title,
                thumbUrl : elem.post_image
            }
        });
        return result
    }

    getMyScrappedExhibition= async (userEmail) => {
        const myScraps = await this.mypageRepository.findAllMyScrappedExhibitionId(userEmail);
        const myScrappedExhibitionIds = myScraps.map((elem)=>elem.exhibition_id);

        const getMyScrappedExhibitions = await this.mypageRepository.findMyExhibition(myScrappedExhibitionIds);

        const result = getMyScrappedExhibitions.map((elem)=>{
            return {
                exhibitionIdx: elem.exhibition_id,
                title : elem.exhibition_title,
                thumbUrl : elem.post_image
            }
        });
        return result
    }

    getMyArtgram = async (userEmail) => {
        const artgrams = await this.mypageRepository.findMyPostArtgram(userEmail);
        const result = artgrams.map((elem)=>{
            return {
                artgramIdx: elem.artgram_id,
                title : elem.artgram_title,
                thumbUrl : elem.imgUrl
            }
        });
        return result
    }
}

module.exports = MypageService;