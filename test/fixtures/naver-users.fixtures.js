/** NaverUsers Controller Fixtures **/
exports.createNaverUserInsertSchemaByController = {
  id: 'archepro85',
  password: '1234',
  nickname: '스파르타11',
  gender: 'MAN',
};

exports.createNaverUserResultSchemaByController = {
  createdAt: '2022-10-16T09:34:00.396Z',
  updatedAt: '2022-10-16T09:34:00.397Z',
  userId: 1,
  id: 'archepro85',
  password: '1234',
  nickname: '스파르타11',
  gender: 1,
};

/** NaverUsers Service Fixtures **/
// Insert Schema
exports.createNaverUserInsertSchema = {
  id: 'archepro85',
  password: '1234',
  nickname: '스파르타11',
  gender: 'MAN',
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

/** NaverUsers Repository Fixtures **/
exports.getNaverUserByPkInsertSchema = { userId: 1 };

// NaverUsersRepository.findNaverUser Method를 사용하기 위한 Schema
exports.findNaverUserInsertSchema = {
  id: 'Archepro84',
  nickname: 'spartaNickName',
};

// NaverUsersRepository.createNaverUser Method를 사용하기 위한 Schema
exports.createNaverUserInsertSchemaByRepository = {
  id: 'archepro85',
  password: '1234',
  nickname: '스파르타11',
  gender: 1,
};
