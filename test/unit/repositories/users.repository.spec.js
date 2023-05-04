const UserRepository = require('../../../repositories/user.repository');
const {
    findByEmailInsertSchema,
    createUserInsertSchemaByRepository,

} = require('../../fixtures/users.fixtures');

const mockUsersModel = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
})

const mockUserProfileModel = () => ({
    create: jest.fn(),
  });

describe('users Repository Layer Test', ()=>{
    let userRepository;

    beforeEach(()=>{
        userRepository = new UserRepository();
        userRepository.Users = mockUsersModel();
        userRepository.UserProfile = mockUserProfileModel();
        jest.resetAllMocks();
    });

    test('findByEmail Method toHaveBeenCalled', async () => {
        const email = findByEmailInsertSchema.email;
        const user = await userRepository.findByEmail(email);

        // findOne 메소드는 몇번 호출되었는지
        expect(userRepository.Users.findOne).toHaveBeenCalledTimes(1);

        // findOne 메소드가 호출된 인자를 검증
        expect(userRepository.Users.findOne).toHaveBeenCalledWith({
            where:  { userEmail: email }
        })
    })

    test('userSignup Method toHaveBeenCalled', async () => {
        const { email, nickname, password, author } = createUserInsertSchemaByRepository;
        const user = await userRepository.userSignup(email, nickname, password, author);

        // User create 메소드는 몇번 호출되었는지
        expect(userRepository.Users.create).toHaveBeenCalledTimes(1);

        // User create 메소드가 호출된 인자를 검증합니다.
        expect(userRepository.Users.create).toHaveBeenCalledWith({
            userEmail: email,
            userPassword: password,
            userRole: author,
        });
        
        // User Profile create 메소드는 몇번 호출되었는지
        expect(userRepository.UserProfile.create).toHaveBeenCalledTimes(1);
        
        // User Profile create 메소드가 호출된 인자를 검증합니다.
        expect(userRepository.UserProfile.create).toHaveBeenCalledWith({
            userEmail: email,
            profileNickname: nickname,
        });
    })
})
