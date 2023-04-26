require("dotenv").config();

const env = process.env;

const config = {
  development: {
    username: env.MYSQL_USERNAME,
    //env.MYSQL_USERNAME은 불러오고자 하는 데이터의 키값이므로 자유롭게 이름설정이 가능하다.
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect: "mysql",
    timezone: "+09:00",
    //port: env.MYSQL_PORT
  },

  test: {
    username: env.MYSQL_USERNAME_TEST,
    password: env.MYSQL_PASSWORD_TEST,
    database: env.MYSQL_DATABASE_TEST,
    host: env.MYSQL_HOST_TEST,
    dialect: "mysql",
    timezone: "+09:00",
    //port: env.MYSQL_PORT,
  },

  production: {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect: "mysql",
    timezone: "+09:00",
    //port: env.MYSQL_PORT
  },
};

module.exports = config;
