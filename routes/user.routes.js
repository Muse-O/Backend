const express = require("express");
const router = express.Router();
const passport = require("passport");

const authLoginMiddleware = require("../middlewares/authLoginMiddleware");
const UserController = require("../controllers/user.controller");

const userController = new UserController();

/**
 * @swagger
 * /auth/emailconfirm:
 *   post:
 *     tags:
 *       - User
 *     summary: "회원가입 전 이메일 중복체크"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "이메일을 입력하세요"
 *     responses:
 *       "200":
 *         description: "회원가입이 가능한 이메일입니다."
 *
 * /auth/emailvalidate:
 *   post:
 *     tags:
 *       - User
 *     summary: "이메일 인증코드 전송 및 Redis 저장"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "이메일을 입력하세요"
 *     responses:
 *       "200":
 *         description: "이메일로 인증코드가 전송되었습니다."
 *       "400":
 *         description: "ERROR"
 *     security:
 *       - jwt: []
 *
 * /auth/emailcodecheck:
 *   post:
 *     tags:
 *       - User
 *     summary: "이메일 인증코드 확인"
 *     parameters:
 *       - in: body
 *         name: body
 *         description: "Request body"
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: "이메일을 입력하세요"
 *             code:
 *               type: string
 *               description: "인증코드를 입력하세요"
 *     responses:
 *       "200":
 *         description: "인증번호가 일치합니다."
 *
 * /auth/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: "회원가입"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "이메일을 입력하세요"
 *               nickname:
 *                 type: string
 *                 description: "닉네임을 입력하세요"
 *               password:
 *                 type: string
 *                 description: "비밀번호를 입력하세요"
 *               author:
 *                 type: string
 *                 description: "작가 이름을 입력하세요"
 *     responses:
 *       "200":
 *         description: "회원가입이 완료되었습니다."
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - User
 *     summary: "로그인"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "이메일을 입력하세요"
 *               password:
 *                 type: string
 *                 description: "비밀번호를 입력하세요"
 *     responses:
 *       "200":
 *         description: "로그인이 성공했습니다."
 */

// 회원가입 전 이메일 중복확인
router.post("/user/check", userController.emailConfirm);

// 인증 메일 발송 및 레디스 저장
router.post("/email", userController.emailValidate);

// 인증번호 검증
router.post("/email/check", userController.emailValidateNumCheck);

// 회원가입
router.post("/user", userController.userSignup); //

// 로컬 로그인
router.post("/token", authLoginMiddleware, userController.localLogin);

// 카카오 로그인 auth/kakao
router.get("/kakao", passport.authenticate("kakao"));

// 카카오 콜백 auth/kakao/callback
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  }),
  userController.socialCallback
);

// 구글 로그인 auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 구글 콜백 auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  }),
  userController.socialCallback
);

// 네이버 로그인 auth/naver
router.get("/naver", passport.authenticate("naver", { authType: "reprompt" }));

// 구글 콜백 auth/google/callback
router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  }),
  userController.socialCallback
);

module.exports = router;
