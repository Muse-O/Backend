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
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const glob = require("glob");
const passport = require("passport");
const passportConfig = require("./passport");
const { description } = require("./schemas/mypageReqSchema");
const {
  apiLogger,
  incrementCounter,
  getCounter,
} = require("./middlewares/apiLogger");
const {
  processRequest,
  isArtgramDetail,
  shouldAddDetail,
} = require("./modules/counter");

const webSocketController = require("./controllers/websocket.cntroller");

const PORT = process.env.SERVER_PORT;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Muse_O 전시회페이지",
      version: "1.0.0",
      description:
        "로그인을 한뒤 Authorization의 토큰값을 상단의 Authorize에 Bearer없이 넣어주시고 사용하시면됩니다. try it out을 눌러야 parameter와 body값을 입력할수있습니다.",
    },
    tags: [
      {
        name: "User",
        description: "유저등록",
      },
      {
        name: "search",
        description: "검색기능 로그인필요x",
      },
      {
        name: "artgram",
        description: "아트그램 CRUD",
      },
      {
        name: "artgramComment",
        description: "아트그램 댓글 CRUD",
      },

      {
        name: "artgramReply",
        description: "아트그램 답글 CRUD",
      },
      {
        name: "notification",
        description: "알림기능",
      },
    ],
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Bearer",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

// get all YAML files in the swagger folder
const yamlFiles = glob.sync("./swagger/*.yaml");
// merge all YAML files into a single swagger specification
const swaggerSpec = yamlFiles.reduce((acc, filePath) => {
  const spec = require(filePath);
  return { ...acc, ...spec };
}, swaggerJSDoc(swaggerOptions));
// app.use(
//   morgan("dev"),
//   morgan("tiny", {
//     stream: {
//       write: (message) => {
//         const method = message.split(" ")[0];
//         const url = message.split(" ")[1].split("?")[0];

//         const action = urlToAction(url, method);

//         if (action === "exclude") {
//           return;
//         }

//         incrementCounter(action, method);
//         const apiRequestCount = getCounter(action, method);

//         const displayName = action;
//         const logglyWinston = apiLogger(action);
//         logglyWinston.info(
//           `${displayName} - ${method} #${apiRequestCount}: ${message.trim()}`
//         );
//       },
//     },
//   })
// );
//winston api호출횟수로깅
app.use(
  morgan("dev"),
<<<<<<< HEAD
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
=======
  // morgan("tiny", {
  //   stream: {
  //     write: (message) => {
  //       const method = message.split(" ")[0];
  //       let apiPath = message.split(" ")[1].split("?")[0]; // API 경로 추출 및 쿼리 파라미터 제거
  //       const apiSegments = apiPath
  //         .split("/")
  //         .filter((segment) => segment && segment !== "api");

  //       const apiName = getApiName(apiSegments);
  //       if (apiName === "exclude") {
  //         return;
  //       }
  //       const isDetail = shouldAddDetail(apiName, apiSegments);
>>>>>>> release

  //       incrementCounter(apiName, method);
  //       const apiRequestCount = getCounter(apiName, method);
  //       const logger = apiLogger(apiName);

<<<<<<< HEAD
        const logglyWinston = apiLogger(apiName);
        logglyWinston.info(
          `${apiName} - ${method} #${apiRequestCount}: ${message.trim()}`
        );
      },
    },
  })
=======
  //       const displayName = isDetail ? `${apiName} Detail` : apiName;

  //       logger.info(
  //         `API Request (${displayName} - ${method}) #${apiRequestCount}: ${message.trim()}`
  //       );
  //     },
  //   },
  // })
>>>>>>> release
);

// cors
app.use(
  cors({
    // origin: "https://museoh.art", //origin 확인 필요
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
app.disable('x-powered-by');

// routes
app.use("/api", routes);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// passport
passportConfig(); // 패스포트 설정

// frontend proxy
app.use(
  "/",
  createProxyMiddleware({
<<<<<<< HEAD
    target: "https://muse-oh.vercel.app",
=======
    target: 'https://museoh.art',
>>>>>>> release
    changeOrigin: true,
  })
);

// errorHandler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

// // API 성능 테스트 결과를 로깅하는 함수
// function logApiPerformanceTestResult(apiName, testResult) {
//   apiLogger.info(
//     `API Performance Test Result (${apiName}): ${JSON.stringify(testResult)}`
//   );
// }
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
