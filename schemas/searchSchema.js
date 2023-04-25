const Joi = require("joi");

const searchSchema = Joi.object({
  searchText: Joi.string().required().messages({
    "string.empty": "카테고리를 문자열로 입력해주세요",
    "any.required": "필수 입력 항목입니다.",
  }),
  type: Joi.string().required().messages({
    "string.empty": "카테고리를 문자열로 입력해주세요",
    "any.required": "필수 입력 항목입니다.",
  }),
  category: Joi.string()
    .required()
    .valid("artgram", "user", "exhibition")
    .messages({
      "string.empty": "카테고리를 문자열로 입력해주세요",
      "string.valid": "카테고리에 해당하지 않는 값입니다.",
      "any.required": "필수 입력 항목입니다.",
    }),
  title: Joi.string().required().messages({
    "string.empty": "카테고리를 문자열로 입력해주세요",
    "any.required": "필수 입력 항목입니다.",
  }),
});

module.exports = { searchSchema };
