const Joi = require('joi');

const mypageSchema = Joi.object({
    profileImg: Joi.string().default('"https://avatars.githubusercontent.com/u/51357635?s=400&u=36fd01b69ccd7729620c086927f9c0847ffdb0e1&v=4"').messages({
        'string.empty': 'profileImg를 문자열로 입력해주세요.',
      }),
    nickname: Joi.string().messages({
        'string.empty': 'nickname을 1글자이상 입력해주세요',
      }),
    introduction: Joi.string().allow(null).default(null)
});

module.exports = mypageSchema;