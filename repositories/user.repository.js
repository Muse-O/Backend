const { Users, UserProfile } = require("../models");

class UserRepository {

  /**
   * 회원가입 전 이메일 중복확인
   * @param {string} email 
   * @returns 이메일과 일치하는 유저
   */
  findByEmail = async (email) => {
    const findEmail = await Users.findOne({
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
    await Users.create({ userEmail: email, userPassword: hashedPassword, userRole: author});
    await UserProfile.create({ userEmail: email, profileNickname: nickname })
  };
}

module.exports = UserRepository;