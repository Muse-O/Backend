const UserService = require("../services/user.service");
const UserRepository = require("../repositories/user.repository")
const logger = require("../middlewares/logger.js");
// const userSchema = require("../schemas/User")

const re_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const re_password = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const Joi = require("joi")

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(re_password).required(),
});

class UserController {
  constructor() {
    this.userService = new UserService();
    this.userRepository = new UserRepository();
  }

  // 로그인
  userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      await this.userService.userLogin(email, password);

      const token = await this.userService.generateToken(email);
      res.set("Authorization", `Bearer ${token}`);

      return res.status(201).json({ message: "로그인에 성공했습니다" });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  // 회원가입
  userSignup = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      await userSchema.validate({ email, password });

      if (email.search(re_email) === -1) {
        throw Boom.badRequest("유효하지 않은 이메일 주소 입니다.");
      }

      if (password.search(re_password) === -1) {
        throw Boom.badRequest("유효하지 않은 패스워드 입니다.");
      }

      const existingUser = await this.userRepository.findByID(email);

      if (existingUser) {
        throw Boom.conflict("중복된 이메일 주소 입니다");
      }

      await this.userService.userSignup(email, password);

      return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
}
module.exports = UserController;
