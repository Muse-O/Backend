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

    getMyExhibition = async (limit, offset, userEmail) => {
        const exhibitions = await this.mypageRepository.findMyPostExhibition(limit, offset, userEmail);
        
        return exhibitions
    };

    getMyLikedExhibition = async (limit, offset, userEmail) =>{
        const myLikes = await this.mypageRepository.findAllMyLikedExhibitionId(userEmail);
        
        if(!myLikes.length){
            return {"message": "좋아요한 게시글이 없습니다."}
        }

        const myLikedExhibitionIds = myLikes.map((elem)=>elem.exhibition_id);
        const getMyLikedExhibitions = await this.mypageRepository.findMyExhibition(limit, offset, myLikedExhibitionIds)
        
        return getMyLikedExhibitions
    }

    getMyScrappedExhibition= async (limit, offset, userEmail) => {
        const myScraps = await this.mypageRepository.findAllMyScrappedExhibitionId(userEmail);

        if(!myScraps.length){
            return {"message": "스크랩한 게시글이 없습니다."}
        }

        const myScrappedExhibitionIds = myScraps.map((elem)=>elem.exhibition_id);

        const getMyScrappedExhibitions = await this.mypageRepository.findMyExhibition(limit, offset, myScrappedExhibitionIds);
        return getMyScrappedExhibitions
    }

    getMyArtgram = async (limit, offset, userEmail) => {
        const artgrams = await this.mypageRepository.findMyPostArtgram(limit, offset, userEmail);
        
        return artgrams
    }

    getMyLikedArtgram = async (limit, offset, userEmail) => {
        const myLikes = await this.mypageRepository.findAllMyLikedArtgramId(userEmail);
        
        if(!myLikes.length){
            return {"message": "좋아요한 게시글이 없습니다."}
        }

        const myLikedArtgramIds = myLikes.map((elem)=>elem.artgram_id);
        const getMyLikedExhibitions = await this.mypageRepository.findMyArtgram(limit, offset, myLikedArtgramIds)
        
        return getMyLikedExhibitions
    }

    getMyScrappedArtgram = async (limit, offset, userEmail) => {
        const myScraps = await this.mypageRepository.findAllMyScrappedArtgramId(userEmail);
        
        if(!myScraps.length){
            return {"message": "스크랩한 게시글이 없습니다."}
        }

        const myScrappedArtgramIds = myScraps.map((elem)=>elem.artgram_id);
        const getMyScrappedArtgrams = await this.mypageRepository.findMyArtgram(limit, offset, myScrappedArtgramIds)
        
        return getMyScrappedArtgrams
    }
}

module.exports = MypageService;