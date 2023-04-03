### 기초 모델 생성
- common_codes
npx sequelize model:generate --name CommonCodes --attributes codeId:string,codeUseTable:string,codeUseColum:string,codeGroupValue:string,codeValue:string,codeMean:string,createdAt:date,updatedAt:date

- users
npx sequelize model:generate --name Users --attributes userEmail:string,userPassword:string,loginType:string,accessToken:string,userRole:string,userStatus:string,createdAt:date,updatedAt:date

- users_profile
npx sequelize model:generate --name UserProfile --attributes profileId:string,userEmail:string,profileNickname:string,profileImg:string,profileIntro:string,createdAt:date,updatedAt:date

- alarms
npx sequelize model:generate --name Alarms --attributes alarmId:string,userEmail:string,alarmSender:string,alarmReceiver:string,alarmContent:string,alarmStatus:string,createdAt:date

- artgrams
npx sequelize model:generate --name Artgrams --attributes artgramId:string,userEmail:string,artgramTitle:string,artgramDesc:string,artgramStatus:string,createdAt:date,updatedAt:date

- article_report
npx sequelize model:generate --name ArticleReport --attributes reportId:string,userEmail:string,artgramId:string,exhibitionId:string,articleType:string,reportMessage:string,reportComplete:string,updatedAt:date

- exhibitions
npx sequelize model:generate --name Exhibitions --attributes exhibitionId:string,userEmail:string,artgramId:string,exhibitionId:string,articleType:string,reportMessage:string,reportComplete:string,updatedAt:date