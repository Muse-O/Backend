require("dotenv").config();

const jwt = require("jsonwebtoken");
const { Users, UserProfile } = require("../models");

module.exports = async (chatroom, token, socket) => {
  const [authType, authToken] = (token ?? "").split(" ");

  if (authType !== "Bearer" || !authToken) {
    // 채팅방에서 퇴장
    socket.leave(chatroom);
    return;
  }

  try {
    const { email } = jwt.verify(authToken, process.env.SECRET_KEY);

    const user = await Users.findOne({
      attributes: ["userEmail"],
      where: { userEmail: email },
    });

    const userProfile = await UserProfile.findOne({
      attributes: ["profileNickname", "profileImg"],
      where: { userEmail: email },
    });

    return {
      userEmail: user.userEmail,
      profileNickname: userProfile.profileNickname,
      profileImg: userProfile.profileImg,
    };
  } catch (err) {
    // 채팅방에서 퇴장
    socket.leave(chatroom);
    return;
  }
};
