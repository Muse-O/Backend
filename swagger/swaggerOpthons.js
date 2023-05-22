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
      {
        name: "admin",
        description: "어드민",
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
  apis: ["../routes/*.js"],
};

module.exports = { swaggerOptions };
