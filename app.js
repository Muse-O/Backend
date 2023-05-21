require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes");
const logger = require("./middlewares/logger.js");
const errorHandler = require("./middlewares/errorHandler.js");
const passport = require("passport");
const passportConfig = require("./passport");
const {
  apiLogger,
  incrementCounter,
  getCounter,
} = require("./middlewares/apiLogger");
const { processRequest } = require("./modules/counter");

const webSocketController = require("./controllers/websocket.cntroller");

const PORT = process.env.SERVER_PORT || 0;

const dotenv = require("dotenv");

// 환경 변수를 로드합니다. NODE_ENV 값에 따라 적절한 파일을 사용합니다.
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

//winston api호출횟수로깅
app.use(
  morgan("dev"),

  morgan("tiny", {
    stream: {
      write: (message) => {
        const method = message.split(" ")[0];
        let apiPath = message.split(" ")[1].split("?")[0].split("/")[2];
        const apiSegments = message
          .split(/[/?\s]/)
          .filter((segment) => segment && segment !== "api")
          .slice(0, -5);

        const apiName = processRequest(apiSegments, method);
        if (apiName === "exclude" || apiName === undefined) {
          return;
        }
        incrementCounter(apiName, method);
        const apiRequestCount = getCounter(apiName, method);

        const logglyWinston = apiLogger(apiName);
        logglyWinston.info(
          `${apiName} - ${method} #${apiRequestCount}: ${message.trim()}`
        );
      },
    },
  })
);

// cors
app.use(
  cors({
    origin: "https://museoh.art", //origin 확인 필요
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Authorization"], //클라이언트가 응답에서 액세스할 수 있는 헤더 목록
    allowedHeaders: ["Authorization", "Content-Type"], //허용되는 요청 헤더 목록
  })
);

// app.use("/uploads", express.static("uploads"));

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded형태의 데이터 해설
app.use(cookieParser());
app.disable("x-powered-by");

// routes
app.use("/api", routes);

// passport
passportConfig(); // 패스포트 설정

// frontend proxy
//프록시 환경변수 등록해서 테스트서버에서는 실행되지않도록 설정
const proxyTarget = process.env.REACT_APP_PROXY_TARGET;
const enableProxy = process.env.REACT_APP_ENABLE_PROXY === "true";

if (enableProxy) {
  app.use(
    "/",
    createProxyMiddleware({
      target: proxyTarget,
      changeOrigin: true,
    })
  );
}

// errorHandler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

// socket.request.cookie/socket.request.session 객체를 사용 가능
io.use((socket, next) => {
  // 외부모듈 미들웨어를 안에다 쓰일수 있다. 미들웨어 확장 원칙에 따라 res, req인자를 준다
  cookieParser(process.env.COOKIE_SECRET)(
    socket.request,
    socket.request.res || {},
    next
  );
});

io.on("connection", (socket) => {
  webSocketController.handleSocketConnection(socket, io);
});

server.listen(PORT, () => {
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});

module.exports = app;
