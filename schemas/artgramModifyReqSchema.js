const Joi = require("joi");

const artgramModify = Joi.object({
  artgramTitle: Joi.string().required().messages({
    "string.empty": "artgramTitle (제목)을 문자열로 입력하세요",
    "any.required":
      "artgramTitle (제목) 값이 요청 매개 변수로 전달되지 않았습니다",
  }),
  artgramDesc: Joi.string().required().messages({
    "string.empty": "artgramDesc (설명)을 문자열로 입력하세요",
    "any.required":
      "artgramDesc (설명) 값이 요청 매개 변수로 전달되지 않았습니다.",
  }),
  hashtag: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .default([])
    .messages({
      "string.empty": "해시태그를 문자열로 입력하세요",
    }),
  artgramImgs: Joi.alternatives()
    .try(
      Joi.object({
        imgUrl: Joi.string().required().messages({
          "string.empty": "imgUrl을 문자열로 입력하세요",
          "any.required": "imgUrl 값이 요청 매개 변수로 전달되지 않았습니다.",
        }),
        imgOrder: Joi.number().integer().min(1).required().messages({
          "number.base": "imgOrder는 정수로 입력하세요",
          "number.integer": "imgOrder는 정수로 입력하세요",
          "number.min": "imgOrder는 1 이상의 정수로 입력하세요",
          "any.required": "imgOrder 값이 요청 매개 변수로 전달되지 않았습니다.",
        }),
      }),
      Joi.array().items(
        Joi.object({
          imgUrl: Joi.string().required().messages({
            "string.empty": "imgUrl을 문자열로 입력하세요",
            "any.required": "imgUrl 값이 요청 매개 변수로 전달되지 않았습니다.",
          }),
          imgOrder: Joi.number().integer().min(1).required().messages({
            "number.base": "imgOrder는 정수로 입력하세요",
            "number.integer": "imgOrder는 정수로 입력하세요",
            "number.min": "imgOrder는 1 이상의 정수로 입력하세요",
            "any.required":
              "imgOrder 값이 요청 매개 변수로 전달되지 않았습니다.",
          }),
        })
      )
    )
    .default([])
    .messages({
      "string.empty": "artgramImgs를 문자열로 입력하세요",
    }),
});

module.exports = artgramModify;
