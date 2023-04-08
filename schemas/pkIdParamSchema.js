const Joi = require('joi');

const pkIdParamSchema = Joi.object().pattern(
  Joi.string().required(), 
  Joi.string()
    .regex(/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i)
    .invalid(/[^a-zA-Z]/)
    .required()
).options({
  messages: {
    "string.base": "값으로 문자만을 보내야합니다.",
    "string.invalid": "영어 대소문자로만 값을 보낼 수 있습니다.",
    "any.required": "서버에 보낼 파라미터를 작성해주세요.",
    "string.pattern.base": "파라미터의 형식이 알맞지 않습니다.",
    "object.unknown": "파라미터의 형식이 알맞지 않습니다."
  },
});

module.exports = pkIdParamSchema;