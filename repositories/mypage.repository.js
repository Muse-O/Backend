const { UserProfile, Exhibitions, ExhibitionLike, ExhibitionScrap, Artgrams, ArtgramImg, Users, ArtgramHashtag, ArtgramLike, ArtgramScrap, ArtgramsComment, sequelize } = require('../models');
const { parseModelToFlatObject } = require('../modules/parseModelToFlatObject')
const { Op } = require('sequelize');

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

    findMyPostExhibition = async (userEmail) => {
        const myExhibition = await Exhibitions.findAll({
            attributes: ['exhibition_id','exhibition_title', 'post_image'],
            where: [{user_email: userEmail}],
            order: [['created_at', 'DESC']],
            raw: true,
        }).then((models) => models.map(parseModelToFlatObject));
        console.log(myExhibition)
        return myExhibition;
    }

    findAllMyLikedExhibitionId = async (userEmail) => {
        const myLikes = await ExhibitionLike.findAll({
            attributes: ['exhibition_id'],
            where:[{user_email: userEmail}],
            order: [['created_at', 'DESC']],
            raw: true,
        }).then((models) => models.map(parseModelToFlatObject));

        return myLikes
    }

    findMyExhibition = async (myLikedExhibitionIds) => {
        const myLikedExhibitions = await Exhibitions.findAll({
            attributes: ['exhibition_id','exhibition_title', 'post_image'],
            raw: true,
            where: {
                exhibition_id : {
                    [Op.in]: myLikedExhibitionIds
                }
            },
            order: [
                [sequelize.literal(`FIELD(exhibition_id, ${myLikedExhibitionIds.map(id => `'${id}'`).join(',')})`)]
            ]
        }).then((models) => models.map(parseModelToFlatObject));

        return myLikedExhibitions
    }

    findAllMyScrappedExhibitionId = async (userEmail) => {
        const myScraps = await ExhibitionScrap.findAll({
            attributes: ['exhibition_id'],
            where:[{user_email: userEmail}],
            order: [['created_at', 'DESC']],
            raw: true,
        }).then((models) => models.map(parseModelToFlatObject));

        return myScraps
    }


    findMyPostArtgram = async (limit,offset,userEmail) => {
        const myArtgram = await Artgrams.findAll({
            attributes: ['artgram_id','artgram_title'],
            include: [
                {
                  model: ArtgramImg,
                  attributes: ["imgUrl"],
                  where: {"imgOrder":1},
                  seperate: true
                },
              ],
            // group: ["Artgrams.artgram_id"],
            where: {
                userEmail: userEmail,
                artgram_status: {
                  [Op.ne]: "AS04",
                },
              },
            order: [["createdAt", "DESC"]], 
            raw: true,
            limit: limit,
            offset: offset,
            subQuery: false
        }).then((models) => models.map(parseModelToFlatObject))

        const myArtgramList = {
            result: myArtgram
        }

        const myArtgramCnt = await Artgrams.count({
            where:{
                artgram_status: {
                    [Op.ne]: "AS04",
                  },
            }
        })

        const hasNextPage = offset + limit < myArtgramCnt;

        const paginationInfo = {
            limit,
            offset,
            myArtgramCnt,
            hasNextPage
        }

        return {myArtgramList, paginationInfo}

    }

}

module.exports = MypageRepository;