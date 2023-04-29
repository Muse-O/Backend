require("dotenv").config();

const jwt = require("jsonwebtoken");
const { Users, UserProfile } = require("../models");

module.exports = async (chatroom, token, socket) => {
  const [authType, authToken] = (token ?? "").split(" ");

  if (authType !== "Bearer" || !authToken) {
    // 클라이언트는 token 에러를 받은 후 로그인 요구
    socket.to(chatroom).emit('socketError', '권한이 존재하지 않습니다. 다시 한번 로그인해주세요.');
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
    // 클라이언트는 token 에러를 받은 후 로그인 요구
    socket.to(chatroom).emit('socketError', '권한이 만료되었습니다. 다시 한번 로그인해주세요.');
    // 채팅방에서 퇴장
    socket.leave(chatroom);
    return;
  }
};
