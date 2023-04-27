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