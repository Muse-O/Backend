const UserService = require("../services/user.service");
const logger = require("../middlewares/logger.js");
const Boom = require("boom");
const Joi = require("joi")

const re_email = /^[a-zA-Z0-9+\-\_.]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/;
const re_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,15}$/;


const userSchema = Joi.object({
  email: Joi.string().email().pattern(re_email).required().messages({
    'string.email': '이메일 주소 형식이 올바르지 않습니다.',
    'string.pattern.base': '이메일 주소 형식이 올바르지 않습니다.',
    'any.required': '이메일 주소를 입력해주세요.',
    'string.empty': '이메일 주소를 입력해주세요.'
  }),
  password: Joi.string().pattern(re_password).required().messages({
    'string.pattern.base': '비밀번호 형식이 올바르지 않습니다.',
    'any.required': '비밀번호를 입력해주세요.',
    'string.empty': '비밀번호를 입력해주세요.'
  })
});

class UserController {
  userService = new UserService();

  // 로그인
  userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password){
        throw Boom.badRequest("요청한 데이터 형식이 올바르지 않습니다.")
      }
      await this.userService.userLogin(email, password);

      const token = await this.userService.generateToken(email);
      res.set("Authorization", `Bearer ${token}`);

      return res.status(201).json({ message: "로그인에 성공했습니다" });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  // 회원가입 전 이메일 중복확인
  emailConfirm = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email){
        throw Boom.badRequest("요청한 데이터 형식이 올바르지 않습니다.")
      }

      await this.userService.findByEmail(email)

      return res.status(201).json({ message: "가입 가능한 이메일입니다." });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  }
  

  // 회원가입
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

      await this.userService.findByEmail(email) // 혹시 모르니 중복 한번 더 확인
      await this.userService.userSignup(email, nickname, password, author);

      return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
}
module.exports = UserController;
