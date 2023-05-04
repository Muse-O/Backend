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

const logglyWinston = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    createDefaultLogglyTransport(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
});

module.exports = { logglyWinston, createLogglyTransport };
