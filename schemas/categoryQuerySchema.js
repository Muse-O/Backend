const Joi = require("joi");

const categorySchema = Joi.object()
  .pattern(
    Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9]*$/i),
    Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9]*$/i)
  )
  .options({
    abortEarly: false, // 모든 카테고리의 오류 검사를 위해 false
    messages: {
      "string.empty": "값으로 문자 혹은 숫자를 보내야합니다.",
      "string.base": "값으로 문자 혹은 숫자를 보내야합니다.",
      "string.allow": "값으로 문자 혹은 숫자를 보내야합니다.",
      "any.required": "서버에 보낼 쿼리 파라미터를 작성해주세요.",
      "string.invalid": "파라미터의 형식이 알맞지 않습니다.",
      "string.pattern.base": "파라미터의 형식이 알맞지 않습니다.",
      "object.unknown": "파라미터의 형식이 알맞지 않습니다.",
    },
  });

module.exports = categorySchema;
