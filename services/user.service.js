require("dotenv").config();
const UserRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const { createHashPassword, comparePassword } = require("../modules/cryptoUtils.js");
const Boom = require("boom");
const { transport } = require('../config/email')

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

  // 이메일 인증 번호 발송
  sendMail = async (email) => {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    console.log("인증번호 콘솔창에 찍어보아",randomNumber)

    const mailContent = {
      from: {
        name: "MUSE-O",
        address: process.env.MUSE_O_EMAIL_ID
      },
      to: email,
      subject: 'MUSE-O에서 보내는 가입 인증 메일입니다',
      html: `<div>이메일 인증 번호는 ${randomNumber}입니다.</div>`,
    }

    const result = transport.sendMail(mailContent, (err,info)=>{
      if (err) {
        throw Boom.internal('이메일 발송 중 예상하지 못한 에러가 발생하였습니다.')
      } else {
        console.log(info.response)
      };
    })
    return result
  }

  // 회원가입
  userSignup = async (email, nickname, password, author) => {
    const hashedPassword = await createHashPassword(password);

    await this.userRepository.userSignup(email, nickname, hashedPassword, author);
  };
}
module.exports = UserService;
