const Joi = require("joi");

const pageQuerySchema = Joi.object({
  limit: Joi.string().regex(/^[0-9]*$/i),
  offset: Joi.string().regex(/^[0-9]*$/i),
  startDate: Joi.string().regex(/^[0-9\s-]*$/i),
  endDate: Joi.string().regex(/^[0-9\s-]*$/i),
  category: Joi.string().regex(/^[A-Z0-9\s]*$/i),
  tag: Joi.string().regex(/^[a-zA-Z가-힣0-9\s#]*$/i),
  where: Joi.string().regex(/^[a-zA-Z가-힣0-9\s]*$/i),
  searchTitle: Joi.string(),
}).messages({
  "string.empty": "파라미터의 형식이 알맞지 않습니다.",
  "any.required": "서버에 보낼 쿼리 파라미터를 작성해주세요.",
  "string.pattern.base": "파라미터의 형식이 알맞지 않습니다.",
  "object.unknown": "파라미터의 형식이 알맞지 않습니다.",
})

module.exports = pageQuerySchema;
