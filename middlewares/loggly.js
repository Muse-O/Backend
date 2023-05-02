const winston = require("winston");
require("winston-loggly-bulk");

const logglyTransport = new winston.transports.Loggly({
  token: "8ff6412e-0912-47fe-98d1-8a7b92d33159",
  subdomain: "ekqls6812",
  tags: ["Winston-NodeJS"],
  json: true,
});

const logglyWinston = winston.createLogger({
  transports: [new winston.transports.Console(), logglyTransport],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
});

module.exports = { logglyWinston };
