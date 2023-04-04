require("dotenv").config();

const express = require("express");
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const routes = require("./routes");
const logger = require("./middlewares/logger.js");
const errorHandler = require("./middlewares/errorHandler.js")
const PORT = process.env.SERVER_PORT;

// morgan
app.use(morgan("dev"));

// cors
app.use(
  cors({
    origin: "*", //origin 확인 필요
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Authorization"], //클라이언트가 응답에서 액세스할 수 있는 헤더 목록
  })
);

// app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded형태의 데이터 해설
app.use(cookieParser());
app.use('/', routes);

// 에러 핸들러
app.use((err, req, res, next) => {

  console.log('\n err => ', typeof(err))
  console.log('\n req => ', typeof(err))
  console.log('\n res => ', typeof(err))
  console.log('\n next => ', typeof(err))

  errorHandler(err, req, res, next);
});

app.get("/", (req, res) => {
  res.send("");
});

app.listen(PORT, () => {
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});

module.exports = app;