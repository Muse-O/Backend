const http = require("http");
const app = require("../../app");
const logger = require("../../middlewares/logger");

const server = http.createServer(app);

//0번 포트로 설정해 동적으로 포트가 실행되도록설정
//운영체제가 사용 가능한 포트를 자동할당.
server.listen(0, () => {
  const address = server.address();
  const port = typeof address === "string" ? address : address.port;
  logger.info(`${port} 포트 번호로 서버가 실행되었습니다.`);
});

module.exports = server;
