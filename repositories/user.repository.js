const { Users } = require("../models");

class UserRepository extends Users {
  constructor() {
    super();
  }

  /**
   * @param {String} email
   */
  //email 매칭 (로그인, 회원가입)
  findByID = async (email) => {
    const findEmail = await Users.findOne({
      where: { userEmail: email },
    });
    return findEmail;
  };

  /**
   * @param {String} email
   * @param {String} password
   */
  //user정보 생성(회원가입)
  userSignup = async (email, password) => {
    const createUser = await Users.create({ userEmail: email, userPassword: password });
    return createUser;
  };
}

module.exports = UserRepository;