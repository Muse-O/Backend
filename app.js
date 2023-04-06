require("dotenv").config();

const express = require("express");
const app = express();

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
const passportConfig = require('./passport')

const PORT = process.env.SERVER_PORT;
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Muse_O",
      version: "1.0.0",
      description: "전시회",
    },
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

// morgan
app.use(morgan("dev"));

// cors
app.use(
  cors({
    origin: "*", //origin 확인 필요
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Authorization"], //클라이언트가 응답에서 액세스할 수 있는 헤더 목록
    allowedHeaders: ["Authorization", "Content-Type"], //허용되는 요청 헤더 목록
  })
);

// app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded형태의 데이터 해설
app.use(cookieParser());
app.use("/", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

passportConfig(); // 패스포트 설정

// 에러 핸들러
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

app.get("/", (req, res) => {
  res.send("");
});

app.listen(PORT, () => {
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});

module.exports = app;
