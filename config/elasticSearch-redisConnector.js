const IORedis = require("ioredis");
const { Client } = require("@elastic/elasticsearch");
const logger = require("../middlewares/logger");
const dotenv = require("dotenv");
dotenv.config();

class RedisElasticsearchConnector {
  constructor() {
    if (
      RedisElasticsearchConnector.instance instanceof
      RedisElasticsearchConnector
    ) {
      return RedisElasticsearchConnector.instance;
    }
    this._setRedis();
    this._setElasticsearch();
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
  }

  _errorHandler(err) {
    logger.error("\n#### Redis connection Error. >> ", err);
  }

  _endHandler() {
    logger.info("#### Redis connection close. ####");
  }

  _connectHandler() {
    RedisElasticsearchConnector.instance = this;
    logger.info("#### Redis connection. ####");
  }

  _setRedisClient() {
    this.client = new IORedis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      connectTimeout: 5000, // 연결 시도 시간(밀리초)
      idleTimeout: 30000, // 최대 유휴 시간(밀리초)
    });
  }

  getClient() {
    return {
      redis: this.client,
      elasticsearch: this.esClient,
    };
  }

  // Elasticsearch
  _setElasticsearch() {
    this.esClient = new Client({
      node: "http://your-elasticsearch-endpoint:9200",
    });
  }

  //노드리스트 설정
  // _setElasticsearch() {
  //   this.esClient = new Client({
  //     nodes: [
  //       { host: "node1", port: 9200 },
  //       { host: "node2", port: 9200 },
  //     ],
  //   });
  // }
}

module.exports = new RedisElasticsearchConnector();
