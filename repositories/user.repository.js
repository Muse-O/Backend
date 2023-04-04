const { Users, UserProfile } = require("../models");

class UserRepository {

  // 회원가입 전 이메일 중복확인
  findByEmail = async (email) => {
    const findEmail = await Users.findOne({
      where: { userEmail: email },
    });
    return findEmail;
  };

  //user정보 생성(회원가입)
  userSignup = async (email, nickname, hashedPassword, author) => {
    await Users.create({ userEmail: email, userPassword: hashedPassword, userRole: author});
    await UserProfile.create({ userEmail: email, profileNickname: nickname })
  };
}

module.exports = UserRepository;