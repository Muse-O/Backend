const { UserProfile, Exhibitions } = require('../models');
const {parseModelToFlatObject} = require('../modules/parseModelToFlatObject')

class MypageRepository{
    findProfileByEmail = async (userEmail) => {
        const profile = await UserProfile.findOne({
            attributes: ['profileImg','profileNickname','profileIntro'],
            where: [{user_email:userEmail}]
        })
        return profile;
    };

    updateMyProfile = async (profileImg, nickname, introduction, userEmail) =>{
        const result = await UserProfile.update({ 
            profileImg : profileImg,
            profileNickname: nickname,
            profileIntro: introduction
         }, { where: {user_email:userEmail} });

        const updatedProfile = await this.findProfileByEmail(userEmail);
        return updatedProfile;
    };

    findMyExhibition = async (userEmail) => {
        const myExhibition = await Exhibitions.findAll({
            attributes: ['exhibition_id','exhibition_title', 'post_image'],
            where: [{user_email: userEmail}],
            raw: true,
        }).then((models) => models.map(parseModelToFlatObject));
        console.log(myExhibition)
        return myExhibition;
    }

    findMyLikedExhibition = async (userEmail) => {

    }

    findMyScrappedExhibition = async (userEmail) => {

    }
}

module.exports = MypageRepository;