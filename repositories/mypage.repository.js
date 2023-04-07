const { UserProfile } = require('../models');

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
    }
}

module.exports = MypageRepository;