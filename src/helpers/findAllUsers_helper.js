async function getArtgramsInfo(findAllArtgrams, myuserEmail) {
  return Promise.all(
    findAllArtgrams.map(async (artgram) => {
      const {
        userProfile,
        likeCount,
        scrapCount,
        likedByCurrentUser,
        scrapByCurrentUser,
        imgCount,
      } = await getArtgramAdditionalInfo(artgram, myuserEmail);

      const { "ArtgramImgs.imgUrl": _, ...rest } = artgram;

      return {
        ...rest,
        nickname: userProfile.profileNickname,
        profileImg: userProfile.profileImg,
        imgUrl: artgram["ArtgramImgs.imgUrl"],
        likeCount,
        imgCount,
        scrapCount,
        liked: !!likedByCurrentUser,
        scrap: !!scrapByCurrentUser,
        createdAt: dayjs(artgram.createdAt)
          //locale은 지역또는 언어설정을 의미함.
          .locale("en")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    })
  );
}

async function getArtgramAdditionalInfo(artgram, myuserEmail) {
  const userEmail = artgram.userEmail;
  const user = await Users.findOne({
    where: { userEmail: userEmail },
    include: [
      { model: UserProfile, attributes: ["profileNickname", "profileImg"] },
    ],
  });

  const userProfile = user.UserProfile;
  const artgramId = artgram.artgramId;

  const likeCount = await ArtgramLike.count({
    where: { artgramId: artgramId },
  });
  const scrapCount = await ArtgramScrap.count({
    where: { artgramId: artgramId },
  });

  const likedByCurrentUser = await ArtgramLike.findOne({
    where: { userEmail: myuserEmail, artgramId: artgramId },
  });
  const scrapByCurrentUser = await ArtgramScrap.findOne({
    where: { userEmail: myuserEmail, artgramId: artgramId },
  });

  const imgCount = await ArtgramImg.count({ where: { artgramId: artgramId } });

  return {
    userProfile,
    likeCount,
    scrapCount,
    likedByCurrentUser,
    scrapByCurrentUser,
    imgCount,
  };
}

async function getAllArtgram(limit, offset, userEmail) {
  const findAllArtgrams = await Artgrams.findAll({
    raw: true,
    attributes: ["artgramId", "artgramTitle", "userEmail", "createdAt"],
    include: [
      {
        model: ArtgramImg,
        attributes: ["imgUrl"],
        where: {
          imgOrder: 1,
        },
      },
    ],
    where: {
      artgram_status: {
        [Op.ne]: "AS04",
      },
    },
    limit: limit,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });
}

module.exports = {};
