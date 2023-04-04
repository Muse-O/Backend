const express = require("express");
const router = express.Router();

const authLoginMiddleware = require('../middlewares/authLoginMiddleware');
const UserController = require("../controllers/user.controller");

const userController = new UserController();

// 회원가입 전 이메일 중복확인
router.post("/emailconfirm", userController.emailConfirm);

// 인증 메일 발송
router.post("/emailvalidate", userController.emailValidate);

// 회원가입
router.post("/signup", userController.userSignup);

// 로그인
router.post("/login", authLoginMiddleware, userController.userLogin);

module.exports = router;