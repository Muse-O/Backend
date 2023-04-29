const { createHashPassword } = require("../../modules/cryptoUtils");

/** NaverUsers Service Fixtures **/
// Insert Schema
exports.findByEmailResultSchema = createHashPassword('asdf1234!')
    .then(hashedPassword => ({
        userEmail: 'hh99@naver.com',
        userPassword: hashedPassword
    }));




exports.userLoginInsertSchema = {
    email: 'hh99@naver.com',
    password: 'asdf1234!',
  };
  
  // Result Schema
  exports.createNaverUserResultSchema = {
    createdAt: '2022-10-16T09:34:00.396Z',
    updatedAt: '2022-10-16T09:34:00.397Z',
    userId: 1,
    id: 'archepro85',
    password: '1234',
    nickname: '스파르타11',
    gender: 1,
  };

/** Users Repository Fixtures **/

// UsersRepository.findByEmail Method를 사용하기 위한 Schema
exports.findByEmailInsertSchema = {
  email: 'test@test.com'
};

// NaverUsersRepository.userSignup Method를 사용하기 위한 Schema
exports.createUserInsertSchemaByRepository = {
    email: 'test@test.com',
    nickname: 'testNick',
    password: 'hashedPassword',
    author: false
  };

// exports.createUserInsertSchemaByRepository = {
//   userEmail: 'test@test.com',
//   userPassword: 'hashedPassword',
//   loginType: 'LT01',
//   accessToken: null,
//   userRole: 'UR01',
//   userStatus: 'US01',
//   createdAt: '2023-04-18 21:58:04',
//   updatedAt: '2023-04-18 21:58:04'

// };


// exports.createUserProfileInsertSchemaByRepository = {
//     profileId: '0a101e8f-0f96-44d6-bd3e-f70e5f6e472b',
//     userEmail: 'test@test.com',
//     profileNickname: 'test',
//     profileImg: 'https://woog-s3-bucket.s3.amazonaws.com/profile/bec2576b-10d5-4286-a7fd-6a1c94855d71.jpeg',
//     profileIntro: null,
//     createdAt: '2023-04-18 21:58:04',
//     updatedAt: '2023-04-18 21:58:04'
//   };

// exports.createUserProfileInsertSchemaByRepository = {
//     profileId: '0a101e8f-0f96-44d6-bd3e-f70e5f6e472b',
//     userEmail: 'test@test.com',
//     profileNickname: 'test',
//     profileImg: 'https://woog-s3-bucket.s3.amazonaws.com/profile/bec2576b-10d5-4286-a7fd-6a1c94855d71.jpeg',
//     profileIntro: null,
//     createdAt: '2023-04-18 21:58:04',
//     updatedAt: '2023-04-18 21:58:04'
// };