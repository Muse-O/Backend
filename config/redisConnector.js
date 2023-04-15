const redis = require("redis");
const logger = require("../middlewares/logger");
const dotenv = require("dotenv");
dotenv.config();

class RedisConnector {
  constructor() {
    if (RedisConnector.instance instanceof RedisConnector) {
      return RedisConnector.instance;
    }
    this._setRedis();
  }

  // connection close
  quit(callback) {
    this.client.quit(callback);
  }

  _setRedis() {
    this._setRedisClient();

    //connect 성공
    this.client.on("connect", this._connectHandler);

    //connect 성공
    this.client.on("error", this._errorHandler);

    //connect 성공
    this.client.on("end", this._endHandler);

    this.client.connect().then();
  }

  _errorHandler(err) {
    logger.error("\n#### Redis connection Error. >> ", err);
  }

  _endHandler() {
    logger.info("#### Redis connection close. ####");
  }

  _connectHandler() {
    RedisConnector.instance = this;
    logger.info("#### Redis connection. ####");
  }

  _setRedisClient() {
    this.client = redis.createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
      legacyMode: true,
    });
  }

  getClient() {
    return this.client.v4;
  }
}

module.exports = new RedisConnector();
