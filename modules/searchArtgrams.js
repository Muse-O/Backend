const { Users, UserProfile, ArtgramLike, ArtgramScrap } = require("../models");
const dayjs = require("dayjs");

const searchArtgram = async (searchResults, myuserEmail) => {
  const filteredSearch = searchResults.filter(
    (artgram) => artgram.artgramStatus !== "AS04"
  );

  const searchResult = await Promise.all(
    filteredSearch.map(async (artgram) => {
      const userEmail = artgram.userEmail;
      const artgramId = artgram.artgramId;

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

      // Get likeCount, scrapCount, likedByCurrentUser, and scrapByCurrentUser in a single query
      const [likeCountData, scrapCountData] = await Promise.all([
        ArtgramLike.findAndCountAll({
          where: { artgramId: artgramId },
          attributes: ["userEmail"],
          raw: true,
        }),
        ArtgramScrap.findAndCountAll({
          where: { artgramId: artgramId },
          attributes: ["userEmail"],
          raw: true,
        }),
      ]);

      const likeCount = likeCountData.count;
      const scrapCount = scrapCountData.count;

      const likedByCurrentUser =
        myuserEmail && myuserEmail !== "guest" && myuserEmail !== undefined
          ? likeCountData.rows.some((like) => like.userEmail === myuserEmail)
          : undefined;

      const scrapByCurrentUser =
        myuserEmail && myuserEmail !== "guest" && myuserEmail !== undefined
          ? scrapCountData.rows.some((scrap) => scrap.userEmail === myuserEmail)
          : undefined;

      const imgUrl = artgram.ArtgramImgs[0].dataValues.imgUrl;
      const { ArtgramImgs, ...rest } = artgram.dataValues;

      const artgramObject = {
        ...rest,
        type: "artgram",
        nickname: userProfile.profileNickname,
        profileImg: userProfile.profileImg,
        imgUrl,
        likeCount,
        imgCount: artgram.ArtgramImgs.length, // 이미 포함된 ArtgramImg를 사용하도록 수정
        scrapCount,
        createdAt: dayjs(artgram.createdAt)
          .locale("en")
          .format("YYYY-MM-DD HH:mm:ss"),
      };

      if (likedByCurrentUser !== undefined) {
        artgramObject.liked = likedByCurrentUser;
      }

      if (scrapByCurrentUser !== undefined) {
        artgramObject.scrap = scrapByCurrentUser;
      }
      return artgramObject;
    })
  );

  return searchResult;
};

module.exports = { searchArtgram };
