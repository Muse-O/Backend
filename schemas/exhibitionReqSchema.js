const Joi = require('joi');

const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Weekdays', '미지정'];

const exhibitionSchema = Joi.object({
  exhibitionId: Joi.string().allow(null).default(null),
  exhibitionTitle: Joi.string().required().messages({
    'string.empty': 'exhibitionTitle(제목)을 문자열로 입력해주세요.',
    'any.required': 'exhibitionTitle(제목)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  exhibitionEngTitle: Joi.string().allow(null, '').default(null),
  exhibitionDesc: Joi.string().required().messages({
    'string.empty': 'exhibitionDesc(설명)을 문자열로 입력해주세요.',
    'any.required': 'exhibitionDesc(설명)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  startDate: Joi.date().required().messages({
    'date.empty': 'startDate(시작일)을 날짜형식의 문자열로 입력해주세요.',
    'any.required': 'startDate(시작일)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  endDate: Joi.date().required().messages({
    'date.empty': 'endDate(종료일)을 날짜형식의 문자열로 입력해주세요.',
    'any.required': 'endDate(종료일)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  postImage: Joi.string().default('https://woog-s3-bucket.s3.ap-northeast-2.amazonaws.com/exhibition/noPost.jpg'),
  exhibitionCode: Joi.string().required().messages({
    'string.empty': 'exhibitionCode(전시 종류)를 입력해주세요',
    'any.required': 'exhibitionCode(전시 종류)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  exhibitionKind: Joi.string().required().messages({
    'string.empty': 'exhibitionKind(전시 온라인(EK0002)/오프라인(EK0001) 종류)를 입력해주세요',
    'any.required': 'exhibitionKind(전시 온라인(EK0002)/오프라인(EK0001) 종류)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  exhibitionOnlineLink: Joi.string().messages().allow('').default('미지정'),
  openDay: Joi.string().valid(...validDays).allow(null, '').empty('').default('미지정'),
  closeDay: Joi.string().valid(...validDays).allow(null, '').empty('').default('미지정'),
  openTime: Joi.date().required().messages({
    'date.empty': 'openTime(시작 시간)을 날짜형식의 문자열로 입력해주세요.',
    'any.required': 'openTime(시작 시간)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  closeTime: Joi.date().required().messages({
    'date.empty': 'closeTime(시작 시간)을 날짜형식의 문자열로 입력해주세요.',
    'any.required': 'closeTime(시작 시간)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  entranceFee: Joi.string().allow(null).default('미지정'),
  artWorkCnt: Joi.string().allow(null).default('미지정'),
  agencyAndSponsor: Joi.string().allow(null).default('미지정'),
  location: Joi.string().required().messages({
    'string.empty': 'location(장소)를 입력해주세요.',
    'any.required': 'location(장소)값이 요청 파라미터로 전달되지 않았습니다.'
  }),
  contact: Joi.string().allow(null).default('미지정'),
  exhibitionCategoty: Joi.array().items(Joi.string()).allow(null, '').default([]),
  artImage: Joi.array().items(Joi.object(
    {
      order: Joi.number().required().messages({
        'string.empty': 'order(이미지 순서) 값을 입력해주세요.',
        'any.required': 'order(이미지 순서)값이 요청 파라미터로 전달되지 않았습니다.',
      }),
      imgUrl: Joi.string().required().messages({
        'string.empty': 'imgUrl(이미지 url) 값을 입력해주세요.',
        'any.required': 'imgUrl(이미지 url)값이 요청 파라미터로 전달되지 않았습니다.',
      }),
      imgCaption: Joi.string().default(null)
    }
  )).default([]),
  authors: Joi.array().items(Joi.object(
    {
      order: Joi.number().required().messages({
        'string.empty': 'order(작가 순서) 값을 입력해주세요.',
        'any.required': 'order(작가 순서)값이 요청 파라미터로 전달되지 않았습니다.',
      }),
      author: Joi.string().required().messages({
        'string.empty': 'author(작가 명) 값을 입력해주세요.',
        'any.required': 'author(작가 명)값이 요청 파라미터로 전달되지 않았습니다.',
      }),
    }
  )).allow(null).default([]),
  delImage: Joi.array().items(Joi.string()).allow(null).default([]),
  detailLocation: Joi.object().allow(null).default({})
});

module.exports = exhibitionSchema;