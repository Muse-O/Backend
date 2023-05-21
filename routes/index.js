const express = require("express");
const router = express.Router();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const glob = require("glob");

const userRouter = require("./user.routes");
const artgramRouter = require("./artgram.routes");
const artgramCommentRouter = require("./artgramComment.routes");
const exhibitionRouter = require("./exhibition.routes");
const exhibitionReviewRouter = require("./exhibitionReview.routes");
const mypageRouter = require("./mypage.routes");
const searchRouter = require("./search.routes");
const bannerRouter = require("./banner.routes");
const notiRouter = require("./notification.routes");
const reportRouter = require("./report.routes");
const adminRouter = require("./admin.routes");
const chatRouter = require("./chat.routes");
const uploadRouter = require("./upload.routes");

router.use("/auth", userRouter);
router.use("/artgram", [artgramRouter, artgramCommentRouter]);
router.use("/exhibition", [exhibitionRouter, exhibitionReviewRouter]);
router.use("/mypage", mypageRouter);
router.use("/search", searchRouter);
router.use("/banner", bannerRouter);
router.use("/notification", notiRouter);
router.use("/report", reportRouter);
router.use("/admin", adminRouter);
router.use("/chat", chatRouter);
router.use("/upload", uploadRouter);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Muse_O 전시회페이지",
      version: "1.0.0",
      description:
        "로그인을 한뒤 Authorization의 토큰값을 상단의 Authorize에 Bearer없이 넣어주시고 사용하시면됩니다. try it out을 눌러야 parameter와 body값을 입력할수있습니다.",
    },
    servers: [
      {
        url: "/api",
      },
    ],
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
  apis: ["./*.js"],
};

// get all YAML files in the swagger folder
const yamlFiles = glob.sync("../swagger/*.yaml");
// merge all YAML files into a single swagger specification
const swaggerSpec = yamlFiles.reduce((acc, filePath) => {
  const spec = require(filePath);
  return { ...acc, ...spec };
}, swaggerJSDoc(swaggerOptions));

// swagger
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
module.exports = router;
