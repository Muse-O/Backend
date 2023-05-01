// const redis = require("redis-mock");
// const { promisify } = require("util");

// class mockRedisConnector {
//   static client = null;

//   static getClient() {
//     if (!mockRedisConnector.client) {
//       mockRedisConnector.client = redis.createClient();

//       // Promisify Redis client functions
//       mockRedisConnector.client.getAsync = promisify(
//         mockRedisConnector.client.get
//       ).bind(mockRedisConnector.client);
//       mockRedisConnector.client.setAsync = promisify(
//         mockRedisConnector.client.set
//       ).bind(mockRedisConnector.client);
//       mockRedisConnector.client.delAsync = promisify(
//         mockRedisConnector.client.del
//       ).bind(mockRedisConnector.client);
//     }

//     return mockRedisConnector.client;
//   }
// }

// module.exports = mockRedisConnector;

const RedisConnector = require("../../config/redisConnector");
const redis = require("redis-mock");

class MockRedisConnector {
  constructor() {
    this.connector = new RedisConnector();
    this.client = redis.createClient();
  }

  async connect() {
    await this.connector.connect();
  }

  getClient() {
    return this.client;
  }

  async disconnect() {
    await this.connector.disconnect();
  }
}

module.exports = new MockRedisConnector();
