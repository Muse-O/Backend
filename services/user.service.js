require("dotenv").config();
const UserRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const { createHashPassword, comparePassword } = require("../modules/cryptoUtils.js");
const Boom = require("boom");

class UserService {
  
  userRepository = new UserRepository();
  
  //로그인
  userLogin = async (email, password) => {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw Boom.notFound("존재하지 않는 이메일 주소입니다");
    }

    const comparePw = await comparePassword(password, user.userPassword);

    if (!comparePw) {
      throw Boom.unauthorized("패스워드를 확인해주세요.");
    }
  };

  //토큰 생성
  generateToken = async (email) => {
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "60m",
    });

    return token;
  };

  // 회원가입 전 이메일 중복확인
  findByEmail = async (email) => {
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw Boom.conflict("중복된 이메일입니다");
    }
  }

  // 회원가입
  userSignup = async (email, nickname, password, author) => {
    const hashedPassword = await createHashPassword(password);

    await this.userRepository.userSignup(email, nickname, hashedPassword, author);
  };
}
module.exports = UserService;
