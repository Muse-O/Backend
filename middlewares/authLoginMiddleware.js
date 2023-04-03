module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const [authType, authToken] = (authorization ?? "").split(" ");

    if (authType === "Bearer" && authToken) {
      return res.status(403).json({
        errorMessage: "이미 로그인이 되어있습니다.",
      });
    }

    next();
  } catch (error) {
    return res.status(400).send({
      errorMessage: "잘못된 접근입니다.",
    });
  }
};