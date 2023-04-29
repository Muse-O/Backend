const {
  ArtgramImg,
  ArtgramLike,
  ArtgramScrap,
  Users,
  UserProfile,
} = require("../models");
const dayjs = require("dayjs");

const searchArtgram = async (search, myuserEmail) => {
  const filteredSearch = search.filter(
    (artgram) => artgram.artgramStatus !== "AS04"
  );

  const searchResult = await Promise.all(
    filteredSearch.map(async (artgram) => {
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

      const imgUrl = artgram.ArtgramImgs[0].dataValues.imgUrl;
      const { ArtgramImgs, ...rest } = artgram.dataValues;

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
