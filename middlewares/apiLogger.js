const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
const {
  createLogglyTransport,
  createDefaultLogglyTransport,
} = require("./loggly");

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
      // new transports.File({ filename: logFileName, level: "info" }),
      createLogglyTransport(apiName),
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
  artgramAll: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramCreate: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramCreateComment: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramCreateReply: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramDelete: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramDeleteComment: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramDeleteReply: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramDetail: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramLike: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramListComments: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramListReplies: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramModify: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramModifyComment: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramModifyReply: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  artgramScrap: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  authGoogle: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  authKakao: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  authLogin: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  authNaver: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  authSignup: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionAll: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionCreate: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionCreateReview: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionDelete: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionDetail: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionLike: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionListReviews: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionModify: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  exhibitionScrap: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  mypageArtgram: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  mypageArtgramDetail: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  mypageArtgramLikes: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  mypageArtgramScraps: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  mypageExhibition: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  mypageExhibitionLikes: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  mypageExhibitionScrap: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  search: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
  searchSaveLastViewed: { GET: 0, POST: 0, PATCH: 0, DELETE: 0 },
};
function incrementCounter(method, apiName) {
  if (!counters[method][apiName]) {
    counters[method][apiName] = 0;
  }
  counters[method][apiName]++;
}

function getCounter(apiName, method) {
  return (counters[apiName] && counters[apiName][method]) || 0;
}

module.exports = {
  apiLogger,
  incrementCounter,
  getCounter,
};
