// loggly.js
const winston = require("winston");
require("winston-loggly-bulk");

function createLogglyTransport(apiName) {
  return new winston.transports.Loggly({
    token: "8ff6412e-0912-47fe-98d1-8a7b92d33159",
    subdomain: "ekqls6812",
    tags: [`Winston-NodeJS-${apiName}`],
    json: true,
  });
}

function createDefaultLogglyTransport() {
  return new winston.transports.Loggly({
    token: "8ff6412e-0912-47fe-98d1-8a7b92d33159",
    subdomain: "ekqls6812",
    tags: ["Winston-NodeJS"],
    json: true,
  });
}

module.exports = { createLogglyTransport, createDefaultLogglyTransport };
