const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const ChatController = require("../controllers/chat.controller.js");
const chatController = new ChatController();

// 채팅방 목록 조회
router.get("/", authMiddleware, chatController.getChatList);
// 채팅 사용자 검색
router.get("/search", authMiddleware, chatController.searchUser);
// 채팅방 생성
router.post("/", authMiddleware, chatController.createChat);
// 이전 채팅 목록 불러오기
router.get("/history", authMiddleware, chatController.getHistory);
// 채팅방 삭제
// router.delete("/:chatId", authMiddleware, chatController.deleteChat);

module.exports = router;