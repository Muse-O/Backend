const { isNotNull } = require("../modules/isNotNull");
const ChatRepository = require("../repositories/chat.repository");
const { sequelize } = require("../models");
const Boom = require("boom");
const RedisClient = require("../config/redisConnector");

class ChatService {
  constructor() {
    this.chatRepository = new ChatRepository();
    this.redisClient = RedisClient.getClient();
  }

  /**
   * 채팅방 목록 조회
   * @param {string} userEmail
   * @returns getMyChatList 검색된 채팅방 목록
   */
  getChatList = async (userEmail) => {
    // 입력 받을 데이터
    // userEmail

    const myChatList = await this.chatRepository.getChatList(userEmail);

    const receiverList = myChatList.map((chat) => chat.chatRoomReceiver);

    const receiverInfoList = await this.chatRepository.getReceiverInfo(receiverList);

    const result = myChatList.map((chat) => {
      const chatRoom = {}
      chatRoom.chatRoomReceiver = chat.chatRoomReceiver;
      chatRoom.messageContent = chat.ChatMessages[0]?.messageContent || "";
      chatRoom.currentMessageTime = chat.ChatMessages[0]?.createdAt || "";
      chatRoom.chatRoomId = chat.ChatParticipants[0].chatRoomId;
      return chatRoom;
    });

    const getMyChatList = [];

    for (let i = 0; i < result.length; i++) {
      const res = result[i];
      const receiver = receiverInfoList.find(row => row.dataValues.userEmail === res.chatRoomReceiver);
      if (receiver) {
        getMyChatList.push({
          ...res,
          ...receiver.dataValues
        });
      }
    }

    return getMyChatList;
  };

  /**
   * 이전 채팅 목록 조회
   * @param {string} userEmail 
   * @param {string} chatRoomId 
   */
  getHistory = async (userEmail, chatRoomId) => {
    // 캐시 메모리내 데이터가 있는 경우 채팅 구성원 모두 disconnect 상태가 아닌 경우.
    const prevMessage = await this.redisClient.lRange(`chat:${chatRoomId}`, 0, -1);
    prevMessage.reverse();

    if(prevMessage && prevMessage.length > 0) {
      const prevMessageList = prevMessage.map((chat) => JSON.parse(chat));

      console.log(prevMessageList);

      return prevMessageList;
    }

    const getIsParticipant = await this.chatRepository.getIsParticipant(userEmail, chatRoomId);

    if(getIsParticipant){
      // 값이 없는 경우 DB에서 조회
      const chatHistory = await this.chatRepository.getHistory(userEmail, chatRoomId);
  
      return chatHistory;
    }else{
      throw Boom.badRequest("채팅방 접근 권한이 없습니다.")
    }
  }

  /**
   * 채팅 유저 검색
   * @param {string} userEmail
   * @param {string} userNickname
   * @returns searchUser 검색된 유저 목록
   */
  searchUser = async (userEmail, userNickname) => {
    // 입력 받을 데이터
    // userNickname

    if (!isNotNull(userNickname)) {
      return [];
    }

    const searchUser = await this.chatRepository.searchUser(
      userEmail,
      userNickname
    );

    return searchUser;
  };

  /**
   * 채팅방 생성
   * @param {string} sender
   * @param {string} receiver
   * @returns createChat 생성된 채팅방 정보
   */
  createChat = async (sender, receiver) => {
    // 입력 받을 데이터
    // sender 대화 요청자
    // receiver 대화 수신자

    // 이미 채팅방이 존재하는지 확인
    const searchSameChat = await this.chatRepository.searchSameChat(
      sender,
      receiver
    );

    if (searchSameChat.length > 0) {
      throw Boom.badRequest("해당 유저와의 채팅방이 이미 존재합니다.");
    }

    const t = await sequelize.transaction();

    try {
      const receiverNickname = await this.chatRepository.searchNickname(
        receiver
      );
      // 채팅방 생성
      const createChat = await this.chatRepository.createChat(
        sender,
        receiver,
        receiverNickname.profileNickname
      );
      // 만들어진 채팅방에 참여자 추가
      await this.chatRepository.createParticipants(createChat);

      await t.commit();

      return createChat;
    } catch (err) {
      await t.rollback();
      throw Boom.badRequest("채팅방 생성에 실패했습니다.");
    }
  };
}

module.exports = ChatService;
