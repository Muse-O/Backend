const Joi = require('joi');

const exhibitionReviewSchema = Joi.object({
  hashTag: Joi.array().items(Joi.string().min(1)).default([]).messages({
    'string.empty': '태그는 문자만 입력할 수 있습니다.',
    'any.required': '서버에 보낼 태그 내용(hashTag) 파라미터의 키 혹은 값을 올바르게 작성해주세요.'
  }),
  reviewComment: Joi.string().allow('').messages({
    'string.empty': '리뷰 내용은 문자만 입력할 수 있습니다.',
    'any.required': '서버에 보낼 리뷰 내용(reviewComment) 파라미터의 키 혹은 값을 올바르게 작성해주세요.'
  }),
  reviewRating: Joi.number().required().messages({
    'string.empty': '전시회 평점은 숫자만 입력할 수 있습니다.',
    'any.required': '서버에 보낼 전시 평점(reviewRating) 파라미터의 키 혹은 값을 올바르게 작성해주세요.'
  })
});

module.exports = exhibitionReviewSchema;