require("dotenv").config();
const UserRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const {
  createHashPassword,
  comparePassword,
} = require("../modules/cryptoUtils.js");
const Boom = require("boom");
const RedisConnector = require("../config/redisConnector");
const { transport } = require("../config/email");
const NotiRepository = require("../repositories/notification.repository");

class UserService {
  redisClient = RedisConnector.getClient();
  userRepository = new UserRepository();
  notiRepository = new NotiRepository();

  /**
   * 일반 로그인
   * @param {string} email
   * @param {string} password
   */
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

  /**
   * 토큰 생성
   * @param {string} email
   * @returns 토큰
   */
  generateToken = async (email) => {
    const user = await this.userRepository.findByEmail(email);

    const userProfile = await this.userRepository.findProfileByEmail(email);

    console.log(userProfile.profileNickname);

    const token = jwt.sign(
      {
        email: email,
        userRole: user.userRole,
        nickname: userProfile.profileNickname,
        profileImg: userProfile.profileImg,
        profileIntro: userProfile.profileIntro,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      }
    );

    return token;
  };

  /**
   * 회원가입 전 이메일 중복확인
   * @param {string} email
   */
  findByEmail = async (email) => {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw Boom.conflict("중복된 이메일입니다");
    }
  };

  /**
   * 이메일 인증 번호 발송
   * @param {string} email
   * @returns 이메일 전송
   */
  sendMail = async (email) => {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    console.log("인증번호 콘솔창에 찍어보아용", randomNumber);

    const randomNumToken = jwt.sign(
      { randomNumber },
      process.env.RANDOM_NUM_TOKEN_KEY,
      {
        expiresIn: "3m",
      }
    );

    try {
      await this.redisClient.set(`emailtoken:${email}`, randomNumToken);
      await this.redisClient.expire(`emailtoken:${email}`, 240);
      console.log("Data stored in Redis");
    } catch (err) {
      console.error(err);
    }

    const mailContent = {
      from: {
        name: "MUSE-O",
        address: process.env.MUSE_O_EMAIL_ID,
      },
      to: email,
      subject: "MUSE-O에서 보내는 가입 인증 메일입니다",
      html: `<div style="max-width: 540px;background-color: black; border-bottom: 1px solid #eaedef; margin: 0 22px; margin-top: 60px;">
      <div style="padding-bottom: 40px; max-width: 473px;font-size: 16px; margin-top: 60px;">
        <a href="https://muse-o.vercel.app/" rel="noopener noreferrer" target="_blank">
         <img src="https://woog-s3-bucket.s3.amazonaws.com/profile/92f80cf8-095e-4535-9bbd-c9b5b03d0ee0.png" style="width: 130px; margin-top: 60px; margin-left: 10px;" alt="muse-o">
        </a>
        <div style="font-size: 18px;color: #eaedef; font-weight: 700; margin-bottom: 10px; margin-top: 60px; margin-left: 10px;">
          인증코드를 확인해주세요.
        </div>
        <span style="
          font-size: 32px;
          margin-left: 10px;
          color: #eaedef; 
          line-height: 42px; 
          font-weight: 700; 
          display: block; 
          margin-top: 6px;">
          ${randomNumber}
        </span>
        <div style="margin-top: 60px; margin-bottom: 40px; margin-left: 10px; line-height: 28px;color: #eaedef;">
          <div style="display: inline-block;">이메일 인증 절차에 따라 이메일 인증코드를 </div> 
          <div style="display: inline-block;"> 발급해드립니다.</div> 
          <div style="display: inline-block;">인증코드는 이메일 발송</div>
          <div style="display: inline-block;">시점으로부터 3분동안 유효합니다.</div>
        </div>
    
      </div>
    </div>
      <div style="padding-top:20px; max-width: 540px; margin-left: 22px;">
        <p style="font-size: 10px; color: #828C94; font-weight: 700;">본 메일은 발신 전용으로 회신되지 않습니다.</p>
        <div style="font-size: 10px; color: #828c94;letter-spacing: -0.3;">
          <div style="display: inline-block; margin-bottom: 4px;">
            <span style="margin-right: 10px;">
              서비스명: MUSE-O
            </span>
            <span style="margin-right: 10px;">
              <a href="https://github.com/Muse-O" style="color: inherit; text-decoration: none;" rel="noopener noreferrer" target="_blank">
                깃허브: https://github.com/Muse-O
              </a>          
            </span>      
          </div>            
          <div>Copyright 2023. muse-o, Co., Ltd. All rights reserved</div>
        </div>
      </div>
    <img width="1px" height="1px" alt="" src="">`,
    };

    const result = transport.sendMail(mailContent, (err, info) => {
      if (err) {
        throw Boom.internal(
          "이메일 발송 중 예상하지 못한 에러가 발생하였습니다."
        );
      } else {
        console.log("메일이 잘 전송되면 뜨는 메시지", info.response);
      }
    });
    return result;
  };

  /**
   * 인증번호 검증
   * @param {string} email
   * @param {number} code
   * @returns 성공 메시지
   */
  emailValidateNumCheck = async (email, code) => {
    const token = await this.redisClient.get(`emailtoken:${email}`);
    if (!token) {
      throw Boom.unauthorized("인증 시간이 만료되었습니다.");
    }
    const { randomNumber } = jwt.verify(
      token,
      process.env.RANDOM_NUM_TOKEN_KEY
    );

    if (randomNumber !== code) {
      throw Boom.unauthorized("이메일 인증코드가 일치하지 않습니다.");
    }

    return { message: "이메일 인증에 성공하였습니다" };
  };

  /**
   * 회원가입
   * @param {string} email
   * @param {string} nickname
   * @param {string} password
   * @param {string} author
   */
  userSignup = async (email, nickname, password, author) => {
    const hashedPassword = await createHashPassword(password);

    await this.notiRepository.createStream(email);
    await this.userRepository.userSignup(
      email,
      nickname,
      hashedPassword,
      author
    );
  };
}
module.exports = UserService;
