const express = require("express");
const router = express.Router();
const passport = require('passport')

const authLoginMiddleware = require("../middlewares/authLoginMiddleware");
const UserController = require("../controllers/user.controller");

const userController = new UserController();

/**
 * @swagger
 * /user/emailconfirm:
 *   post:
 *     tags:
 *       - User
 *     summary: "회원가입 전 이메일 중복확인"
 *     parameters:
 *       - name: email
 *         in: formData
 *         description: "이메일을 입력하는 곳입니다."
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "가입가능한 이메일입니다."
 * /user/emailvalidate:
 *   post:
 *     tags:
 *       - User
 *     summary: "인증 메일 발송 및 레디스 저장"
 *     parameters:
 *      - name: email
 *        in: formData
 *        description: "이메일을 입력하는 곳입니다."
 *        required: true
 *        type: string
 *     responses:
 *       "200":
 *         description: "인증메일이 성공적으로 발송되었습니다."
 *       "400":
 *         description: "오류"
 *     security:
 *       - jwt: []
 * /user/emailcodecheck:
 *   post:
 *     tags:
 *       - User
 *     summary: "인증번호 검증"
 *     parameters:
 *       - name: email
 *         in: formData
 *         description: "이메일을 입력하는 곳입니다."
 *         required: true
 *         type: string
 *       - name: code
 *         in: formData
 *         description: "인증코드를 입력하는 곳입니다."
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "인증번호가 일치합니다."
 * /user/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: "회원가입"
 *     parameters:
 *       - name: email
 *         in: formData
 *         description: "이메일을 입력하는 부분입니다."
 *         required: true
 *         type: string
 *       - name: nickname
 *         in: formData
 *         description: "닉네임을 입력하는 부분입니다."
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         description: "패스워드를 입력하는 부분입니다."
 *         required: true
 *         type: string
 *       - name: author
 *         in: formData
 *         description: "author를 입력하는 부분입니다."
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "회원가입에 성공하였습니다."
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: "로그인"
 *     parameters:
 *       - name: email
 *         in: formData
 *         description: "이메일을 입력하는 부분입니다."
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         description: "패스워드를 입력하는 부분입니다."
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: "로그인에 성공하였습니다."
 */

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
