const ChatService = require("../services/chat.service.js");
const Boom = require("boom");
const Joi = require("joi");

const searchUserSchema = Joi.object({
  userNickname: Joi.string().allow(null, "").messages({
    "any.required": "검색할 유저의 닉네임을 입력해주세요.",
  }),
});

const createUserSchema = Joi.object({
  receiver: Joi.string().messages({
    "any.required": "대화 상대를 선택해주세요.",
  }),
});

class ChatController {
  constructor() {
    this.chatService = new ChatService();
  }

  /**
   * 채팅방 목록 조회
   */
  getChatList = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const chatList = await this.chatService.getChatList(userEmail);

      return res
        .status(200)
        .json({ chatList, message: "채팅방 목록을 조회했습니다." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 이전 채팅 목록 조회
   */
  getHistory = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { chatRoomId } = req.query;

      const chatHistory = await this.chatService.getHistory(
        userEmail,
        chatRoomId
      );

      return res
        .status(200)
        .json({ chatHistory, message: "이전 채팅 목록을 조회했습니다." });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 채팅 유저 검색
   */
  searchUser = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const { userNickname } = await searchUserSchema
        .validateAsync(req.query)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const searchUser = await this.chatService.searchUser(
        userEmail,
        userNickname
      );

      return res
        .status(200)
        .json({ searchUser: searchUser, message: "유저 목록을 조회했습니다." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 채팅방 생성
   */
  createChat = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;

      const { receiver } = await createUserSchema
        .validateAsync(req.body)
        .catch((err) => {
          res.status(400).json({ message: err.message });
          throw Boom.badRequest(err.message);
        });

      const createChat = await this.chatService.createChat(userEmail, receiver);

      // redis pub/sub 등록
      // redis publish
      // redis subscribe

      const { chatRoomId, chatRoomName, createdAt } = createChat;

      return res
        .status(200)
        .json({
          chatInfo: { chatRoomId, chatRoomName, createdAt },
          message: "해당 유저와 대화를 시작합니다.",
        });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ChatController;
