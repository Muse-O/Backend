const UserService = require('../../../services/user.service');
const { findByEmailResultSchema, userLoginInsertSchema } = require('../../fixtures/users.fixtures')
const { comparePassword } = require("../../../modules/cryptoUtils");

const mockUserRepository = {
    findByEmail: jest.fn(),
}

describe('UserService Layer Test', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService.comparePassword = comparePassword
    jest.resetAllMocks();
  });

  test('userLogin Method의 Success Case', async () => {
    // Repository를 Mocking
    userService.userRepository = Object.assign(
        {},
        mockUserRepository
    );
    // Repository의 findByEmail Method의 Mock된 결과 값을 수정
    userService.userRepository.findByEmail = jest.fn(
        () => Promise.resolve(findByEmailResultSchema)
      );
      
    
    const { email, password } = userLoginInsertSchema


    const user = await userService.userLogin(
        email,
        password 
    )

    // findByEmail 메소드를 호출할 때, 어떤 값이었는지 검증
    expect(userService.userRepository.findByEmail).toHaveBeenCalledWith({
        email: findByEmailResultSchema.userEmail,
    })

    // findByEmail 메소드가 몇번 호출되었는지 확인
    expect(
        userService.userRepository.findByEmail
    ).toHaveBeenCalledTimes(1);

    await expect(userService.comparePassword(password, hashedPassword)).resolves.toBeTruthy();
  })
});


