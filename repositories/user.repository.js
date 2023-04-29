const { Users, UserProfile } = require("../models");

class UserRepository {
  constructor() {
    this.Users = Users;
    this.UserProfile = UserProfile;
  }
  /**
   * 회원가입 전 이메일 중복확인
   * @param {string} email 
   * @returns 이메일과 일치하는 유저
   */
  findByEmail = async (email) => {
    const findEmail = await this.Users.findOne({
      where: { userEmail: email },
    });
    return findEmail;
  };

  /**
   * user정보 생성(회원가입)
   * @param {string} email 
   * @param {string} nickname 
   * @param {string} hashedPassword 
   * @param {string} author 
   */
  userSignup = async (email, nickname, hashedPassword, author) => {
    await this.Users.create({ userEmail: email, userPassword: hashedPassword, userRole: author});
    await this.UserProfile.create({ userEmail: email, profileNickname: nickname })
  };
}

module.exports = UserRepository;