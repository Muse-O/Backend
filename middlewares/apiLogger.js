const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { createLogglyTransport } = require("../middlewares/loggly");

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
      timestamp({
        format: () => dayjs().locale("en").format("YYYY-MM-DD HH:mm:ss"),
      }),
      printf(
        ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
      )
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: logFileName, level: "info" }),
      createLogglyTransport(apiName), // Add Loggly transport with apiName as tag
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
  auth: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  login: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgram: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramDetail: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramLike: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramScrap: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  comments: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  reply: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
};

function incrementCounter(apiName, method) {
  if (counters[apiName] && counters[apiName][method]) {
    counters[apiName][method]++;
  } else {
    // 새로운 API가 발견되면 초기값을 설정합니다.
    counters[apiName] = { GET: 0, POST: 0, PUT: 0, DELETE: 0 };
    counters[apiName][method]++;
  }
}

function getCounter(apiName, method) {
  if (counters[apiName] && counters[apiName][method]) {
    return counters[apiName][method];
  } else {
    // 새로운 API가 발견되면 초기값을 설정합니다.
    counters[apiName] = { GET: 0, POST: 0, PUT: 0, DELETE: 0 };
    return counters[apiName][method];
  }
}

module.exports = {
  apiLogger,
  incrementCounter,
  getCounter,
};
