// const { Sequelize } = require("sequelize");
// const config = require("../config/config.js");
// const models = require("../models");

// const testConfig = config.test;
// const testSequelize = new Sequelize(
//   testConfig.database,
//   testConfig.username,
//   testConfig.password,
//   testConfig
// );

// // 모든 모델을 가져와 새로 생성한 testSequelize 객체에 연결
// Object.values(models).forEach((model) => {
//   if (model instanceof Sequelize.Model) {
//     model.init(model.attributes, {
//       ...model.options,
//       sequelize: testSequelize,
//     });
//   }
// });

// async function main() {
//   // models와 실제 데이터베이스간 변경사항을 동기화합니다.
//   await testSequelize.sync({ alter: true });
// }

// main();

const { sequelize } = require("../models");

async function main() {
  // models와 실제 데이터베이스간 변경사항을 동기화합니다.
  await sequelize.sync({ alter: true });

  // 모든 작업이 완료되면 프로세스를 종료합니다.
  process.exit(0);
}

main();
