require("dotenv").config();

const Joi = require("joi");
const UserRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const {
  createHashPassword,
  comparePassword,
} = require("../modules/cryptoUtils.js");
const Boom = require("boom");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * @param {String} email
   * @param {String} password
   */
  //로그인
  userLogin = async (email, password) => {
    const user = await this.userRepository.findByID(email);

    if (!user) {
      throw Boom.notFound("존재하지 않는 이메일 주소입니다");
    }

    const comparePw = await comparePassword(password, user.userPassword);

    if (!comparePw) {
      throw Boom.unauthorized("패스워드를 확인해주세요.");
    }
  };

  /**
   * @param {String} email
   */
  //토큰 생성
  generateToken = async (email) => {
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "60m",
    });

    return token;
  };

  /**
   * @param {String} email
   * @param {String} password
   */
  //회원가입
  userSignup = async (email, password) => {
    const hashedPassword = await createHashPassword(password);

    await this.userRepository.userSignup(email, hashedPassword);
  };
}
module.exports = UserService;
