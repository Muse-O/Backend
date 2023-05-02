// const chatService = require('../services/chatService');
const logger = require('../middlewares/logger');
const authMiddleWare = require('../middlewares/authMiddleware_socket');
const RedisClient = require("../config/redisConnector");
const client = RedisClient.getClient();

const handleSocketConnection = (socket, io) => {
  const chatInfo = {}

  socket.on("joinChatRoom", async () => {
    chatInfo.chatRoomId = socket.handshake.query.chatRoomId;
    chatInfo.user = await authMiddleWare(
      chatInfo.chatRoomId,
      socket.request.cookies.chat_access_token,
      socket
    );
    socket.join(chatInfo.chatRoomId);
  });

  // userEmail: user.userEmail,
  // profileNickname: userProfile.profileNickname,
  // profileImg: userProfile.profileImg,

  socket.on("sendMessage", async (data) => {
    const message = {
      sender: chatInfo.user.userEmail,
      senderName: chatInfo.user.profileNickname,
      senderImg: chatInfo.user.profileImg,
      content: data.messageContent,
      createdAt: data.sendDate
    };

    client.lPush(`chat:${chatInfo.chatRoomId}`, JSON.stringify({
      ...message
    }))

    // 메시지를 채팅방에 브로드캐스트한다.
    // socket.emit("newMessage", message);
    io.to(chatInfo.chatRoomId).emit("newMessage", message);

    // 메시지를 DB에 저장한다.
    // saveMessage(roomId, message);
  });

  socket.on("disconnect", () => {
    // 채팅방에서 사용자를 제거한다.
    if (chatInfo.chatRoomId) {
      io.to(chatInfo.chatRoomId).emit("userLeft", chatInfo.user);
      socket.leave(chatInfo.chatRoomId);
    }
  });
};

module.exports = {
  handleSocketConnection
};