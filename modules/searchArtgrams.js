const {
  ArtgramImg,
  ArtgramLike,
  ArtgramScrap,
  Users,
  UserProfile,
} = require("../models");
const dayjs = require("dayjs");

const searchArtgram = async (search, myuserEmail) => {
  console.log("myuserEmail", myuserEmail);
  const searchResult = await Promise.all(
    search.map(async (artgram) => {
      const userEmail = artgram.userEmail;
      const user = await Users.findOne({
        where: { userEmail: userEmail },
        include: [
          {
            model: UserProfile,
            attributes: ["profileImg", "profileNickname"],
          },
        ],
      });
      const userProfile = user.UserProfile;
      const artgramId = artgram.artgramId;

      const likeCount = await ArtgramLike.count({
        where: { artgramId: artgramId },
      });
      const imgCount = await ArtgramImg.count({
        where: { artgramId: artgramId },
      });
      const scrapCount = await ArtgramScrap.count({
        where: { artgramId: artgramId },
      });

      const { "ArtgramImgs.imgUrl": imgUrl, ...rest } = artgram.dataValues;

      const likedByCurrentUser =
        myuserEmail !== "guest" && myuserEmail !== undefined
          ? await ArtgramLike.findOne({
              where: {
                userEmail: myuserEmail,
                artgramId: artgramId,
              },
            })
          : null;

      const scrapByCurrentUser =
        myuserEmail !== "guest" && myuserEmail !== undefined
          ? await ArtgramScrap.findOne({
              where: {
                userEmail: myuserEmail,
                artgramId: artgramId,
              },
            })
          : null;

      const artgramObject = {
        ...rest,
        type: "artgram",
        nickname: userProfile.profileNickname,
        profileImg: userProfile.profileImg,
        imgUrl,
        likeCount,
        imgCount,
        scrapCount,
        liked: !!likedByCurrentUser,
        scrap: !!scrapByCurrentUser,
        createdAt: dayjs(artgram.createdAt)
          .locale("en")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
      return artgramObject;
    })
  );

  return searchResult;
};

module.exports = { searchArtgram };
