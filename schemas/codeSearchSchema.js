const Joi = require('joi');

const codeSearchSchema = Joi.object({
  category: Joi.string().pattern(/^[a-zA-Z,]*$/i).required().messages({
    'string.empty': '요청할 카테고리 대분류 코드를 보내주세요.',
    'any.required': '서버에 보낼 파라미터의 키 혹은 값을 올바르게 작성해주세요.',
    "string.pattern.base": "알파벳 혹은 구분자(,)만 입력해주세요."
  })
});

module.exports = codeSearchSchema;