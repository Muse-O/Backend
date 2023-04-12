require("dotenv").config();

const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization;

  const [authType, authToken] = (authorization ?? "").split(" ");

  if (authType !== "Bearer" || !authToken) {
    res.locals.user = "guest";
  }

  try {
    const { email } = jwt.verify(authToken, process.env.SECRET_KEY);

    const user = await Users.findOne({
      where: { userEmail: email },
    });

    res.locals.user = user;

    next();
  } catch (err) {
    // 사용자 인증에 실패한 이유
    console.error(err);

    next();
  }
};
