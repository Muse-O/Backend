const {
  ChatMessages,
  ChatParticipants,
  ChatResources,
  ChatRooms,
  UserProfile,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

class ExhibitionReviewRepository {
  /**
   * 채팅방 목록 조회
   * @param {string} userEmail
   * @returns getMyChatList 나의 채팅방 목록
   */
  getChatList = async (userEmail) => {
    // 입력 받을 데이터
    // userEmail

    // Inner Join 후 현재 사용자 이메일의 활성 채팅방 추출
    const getMyChatList = await ChatRooms.findAll({
      include: [
        {
          model: ChatParticipants,
          where: { userEmail: userEmail },
          attributes: ['chatRoomId']
        },
        {
          model: ChatMessages,
          order: [['createdAt', 'DESC']],
          limit: 1,
          attributes: ['messageContent', 'createdAt', 'userEmail']
        }
      ],
      where: { chatRoomStatus: { [Op.ne]: 'RS0003' } },
      attributes: ['chatRoomReceiver'],
    });

    return getMyChatList;
  };

  /**
   * 채팅방내 상대방 목록 조회
   * @param {string} userEmail
   * @returns getOtherList 채팅방내 상대방 목록
   */
  getOtherList = async (userEmail) => {
    const getOtherList = await ChatParticipants.findAll({
      where: { userEmail: { [Op.ne]: userEmail } },
      attributes: ['userEmail'],
    });

    return getOtherList;
  };

  /**
   * 해당 채팅방에 속한 참여자인지 확인
   * @param {string} userEmail 
   * @param {string} chatRoomId 
   * @returns getIsParticipant 채팅방 소속 확인
   */
  getIsParticipant = async (userEmail, chatRoomId) => {
    console.log('\n\n음..\n\n',userEmail, chatRoomId);
    const getIsParticipant = await ChatParticipants.findOne({
      where: {[Op.and]: [{userEmail}, {chatRoomId}]},
    }).catch(err => console.log(err));

    return getIsParticipant;
  }

  /**
   * 이전 채팅 목록
   * @param {string} chatRoomId 
   * @returns getHistory 이전 채팅 목록
   */
  getHistory = async (chatRoomId) => {
    const getHistory = await ChatMessages.findAll({
      where: { chatRoomId },
      order: [['createdAt', 'ASC']],
    });

    return getHistory;
  }

  /**
   * 채팅방 상대방 정보
   * @param {array} receiverList
   * @returns getReceiverInfoList 채팅방 상대방 정보 목록
   */
  getReceiverInfo = async (receiverList) => {
    // 입력 받을 데이터
    // receiverList

    const getReceiverInfoList = await UserProfile.findAll({
      attributes: ["userEmail", "profileNickname", "profileImg"],
      where: { userEmail: { [Op.in]: receiverList } },
    });

    return getReceiverInfoList;
  }

  /**
   * 채팅 사용자 검색
   * @param {string} userEmail
   * @param {string} userNickname
   * @returns searchChatUser 검색된 유저 목록
   */
  searchUser = async (userEmail, userNickname) => {
    // 입력 받을 데이터
    // userNickname

    // Inner Join 후 현재 사용자 이메일의 활성 채팅방 추출
    const searchChatUser = await UserProfile.findAll({
      where: {
        [Op.and]: [
          { userEmail: { [Op.ne]: userEmail } },
          { profileNickname: { [Op.like]: `%${userNickname}%` } },
        ],
      },
    });

    return searchChatUser;
  };

  /**
   * 만들어진 채팅방이 있는지 검색
   * @param {string} sender
   * @param {string} receiver
   * @returns getSameChat 채팅방 정보
   */
  searchSameChat = async (sender, receiver) => {
    // 입력 받을 데이터
    // sender 대화 요청자
    // receiver 대화 수신자

    const getSameChat = await ChatRooms.findAll({
      where: { [Op.and]: [{ chatRoomSender: sender }, { chatRoomReceiver: receiver }] }
    });
    return getSameChat;
  }

  /**
   * 닉네임 추출
   * @param {string} userEmail
   * @returns searchChatUser 생성된 채팅방 정보
   */
  searchNickname = async (userEmail) => {
    // 입력 받을 데이터
    // userEmail

    const searchNickname = await UserProfile.findOne({
      attributes: ['profileNickname'],
      where: { userEmail: userEmail }
    });

    return searchNickname;
  };

  /**
   * 채팅방 생성
   * @param {string} sender
   * @param {string} receiver
   * @returns searchChatUser 생성된 채팅방 정보
   */
  createChat = async (sender, receiver, receiverNickname) => {
    // 입력 받을 데이터
    // sender 대화 요청자
    // receiver 대화 수신자

    const createChat = await ChatRooms.create({
      chatRoomSender: sender,
      chatRoomReceiver: receiver,
      chatRoomName: 'Chat with '+receiverNickname,
      chatRoomStatus: 'RS0001',
      chatRoomKind: 'RK0001'
    });

    return createChat;
  };

  /**
   * 참여자 생성
   * @param {object} chatInfo
   * @returns participants 생성된 채팅 참여자 정보
   */
  createParticipants = async (chatInfo) => {
    // 입력 받을 데이터
    // chatInfo 채팅방 정보

    // 채팅방 참여자 정보 생성
    await ChatParticipants.bulkCreate([
      { userEmail: chatInfo.chatRoomSender, chatRoomId: chatInfo.chatRoomId, chatRoomRole: 'CR0001' },
      { userEmail: chatInfo.chatRoomReceiver, chatRoomId: chatInfo.chatRoomId, chatRoomRole: 'CR0002' }
    ]);
  };

  /**
   * 채팅방 검색
   * @param {string} chatRoomId 
   * @returns selectChat 검색된 채팅방 정보
   */
  selectChat = async (chatRoomId) => {
    const selectChat = await ChatRooms.findAll({
      where: chatRoomId
    })

    return selectChat
  }

}

module.exports = ExhibitionReviewRepository;