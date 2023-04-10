const express = require("express");
const router = express.Router();
const RedisConnector = require("../config/redisConnector");

const redisClient = RedisConnector.getClient();

redisClient.set("mykey", "myvalue", function (err, result) {
  if (err) throw err;
  console.log(result);
});

redisClient.get("mykey", function (err, result) {
  if (err) throw err;
  console.log(result);
});

redisClient.quit();

module.exports = router;
