const UserService = require("../services/user.service");
const logger = require("../middlewares/logger.js");
const Boom = require("boom");
const userSchema = require("../schemas/userReqSchema");

class UserController {
  userService = new UserService();

  /**
   * 일반 로그인
   */
  localLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw Boom.badRequest("요청한 데이터 형식이 올바르지 않습니다.");
      }
      await this.userService.userLogin(email, password);

      const token = await this.userService.generateToken(email);
      res.set("Authorization", `${token}`);

      return res.status(201).json({ message: "로그인에 성공했습니다" });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * Strategy 성공시
   */
  socialCallback = async (req, res, next) => {
    try {
    const email = req.user.userEmail
    const token = await this.userService.generateToken(email);
    // res.set("Authorization", `${token}`);
    res.cookie("authorization", `Bearer ${token}`);
    console.log("strategy 성공시", email)
    // res.redirect("http://localhost:4000");
    // res.setHeader('Set-Cookie', 'authorization='+`Bearer ${token}`+'; Path=/; HttpOnly');
    return res.redirect(302, 'http://localhost:3000');
    } catch (error){
    logger.error(error.message);
    next(error);
    }
  };

  /**
   * 회원가입 전 이메일 중복확인
   */
  emailConfirm = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw Boom.badRequest("요청한 데이터 형식이 올바르지 않습니다.");
      }

      await this.userService.findByEmail(email);

      return res.status(201).json({ message: "가입 가능한 이메일입니다." });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /*
   *인증번호 메일 전송
   */
  emailValidate = async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw Boom.badRequest("요청한 데이터 형식이 올바르지 않습니다.");
      }
      await this.userService.sendMail(email);
      return res
        .status(201)
        .json({ message: "인증 메일이 성공적으로 발송되었습니다." });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 인증번호 검증
   */
  emailValidateNumCheck = async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const result = await this.userService.emailValidateNumCheck(email, code);

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 회원가입
   */
  userSignup = async (req, res, next) => {
    try {
      const { email, nickname, password, author } = req.body;

      const data = { email, password };
      const validate = userSchema.validate(data);

      if (validate.error) {
        throw Boom.badRequest(validate.error.message);
      } else {
        console.log("Valid input!");
      }

      await this.userService.findByEmail(email); // 혹시 모르니 중복 한번 더 확인
      await this.userService.userSignup(email, nickname, password, author);

      return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
}
module.exports = UserController;
