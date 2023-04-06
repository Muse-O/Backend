const express = require("express");
const router = express.Router();
const passport = require('passport')

const authLoginMiddleware = require('../middlewares/authLoginMiddleware');
const UserController = require("../controllers/user.controller");

const userController = new UserController();

// 회원가입 전 이메일 중복확인
router.post("/emailconfirm", userController.emailConfirm);

// 인증 메일 발송 및 레디스 저장
router.post("/emailvalidate", userController.emailValidate);

// 인증번호 검증
router.get('/emailcodecheck', userController.emailValidateNumCheck);

// 회원가입
router.post("/signup", userController.userSignup);

// 로컬 로그인
router.post("/login", authLoginMiddleware, userController.localLogin);

// 카카오 로그인 auth/kakao
router.get("/kakao", passport.authenticate('kakao'));

// 카카오 콜백 auth/kakao/callback
router.get("/kakao/callback", passport.authenticate('kakao',{
    failureRedirect: '/',
    failureFlash: true,
    session: false,
    }), userController.socialCallback)

// 구글 로그인 auth/google
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 콜백 auth/google/callback
router.get("/google/callback", passport.authenticate('google', {
        failureRedirect: '/',
        failureFlash: true,
        session: false,
    }), userController.socialCallback);

// 네이버 로그인 auth/naver
router.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }));

// 구글 콜백 auth/google/callback
router.get("/naver/callback", passport.authenticate('naver', {
    failureRedirect: '/',
    failureFlash: true,
    session: false,
}), userController.socialCallback);

module.exports = router;