const Boom = require("boom");
const logger = require("./logger")

const errorHandler = (err , req , res, next) => {
  
  logger.error(err.stack);

  if(err instanceof Boom){
    return res.status(err.output.payload.statusCode).json({
      errorMessage: err.output.payload.message
    });
  }

  // 500 error
  return res.status(500).json({
    errorMessage: "서버 에러가 발생했습니다."
  });

};

module.exports = errorHandler;