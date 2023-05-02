const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");

// 로그 형식 설정
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

// API별 로그 폴더 생성 함수
function createLogDir(apiName) {
  const logsDir = path.join(__dirname, "..", "logs");
  const apiDir = path.join(logsDir, apiName);
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  return apiDir;
}

function apiLogger(apiName) {
  const logFileName = `./logs/${apiName}.log`;
  return createLogger({
    level: "info",
    format: combine(
      timestamp(),
      printf(
        ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
      )
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: logFileName, level: "info" }),
      new DailyRotateFile({
        filename: `${createLogDir(apiName)}/%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    ],
  });
}

const counters = {
  GET: {},
  POST: {},
  PATCH: {},
  DELETE: {},
};

function incrementCounter(apiName, method) {
  if (!counters[method][apiName]) {
    counters[method][apiName] = 0;
  }
  counters[method][apiName]++;
}

function getCounter(apiName, method) {
  return counters[method][apiName] || 0;
}

module.exports = {
  apiLogger,
  incrementCounter,
  getCounter,
};
