const { sequelize } = require("../models/index.js");

async function main() {
  // models와 실제 데이터베이스간 변경사항을 동기화합니다.
  await sequelize.sync({ alter: true });
}

main();