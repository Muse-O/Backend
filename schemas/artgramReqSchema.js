const Joi = require("joi");

const artgramSchema = Joi.object({
  artgramTitle: Joi.string().required().messages({
    "string.empty": "artgramTitle(제목)을 문자열로 입력해주세요",
    "any.required":
      "artgramTitle(제목)값이 요청 파라미터로 전달되지 않았습니다",
  }),
  artgramDesc: Joi.string().required().messages({
    "string.empty": "artgramDesc(설명)을 문자열로 입력해주세요",
    "any.required": "artgramDesc(설명)값이 요청 파라미터로 전달되지않았습니다.",
  }),
  hashtag: Joi.string().messages({
    "string.empty": "hashtag(태그)를 문자열로 입력해주세요",
  }),
});

module.exports = artgramSchema;
