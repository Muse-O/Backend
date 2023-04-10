const Joi = require('joi');

const re_email = /^[a-zA-Z0-9+\-\_.]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/;
const re_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,15}$/;

const userSchema = Joi.object({
    email: Joi.string().pattern(re_email).required().messages({
      'string.pattern.base': '이메일 주소 형식이 올바르지 않습니다.',
      'any.required': '이메일 주소를 입력해주세요.',
      'string.empty': '이메일 주소를 입력해주세요.'
    }),
    password: Joi.string().pattern(re_password).required().messages({
      'string.pattern.base': '비밀번호 형식이 올바르지 않습니다.',
      'any.required': '비밀번호를 입력해주세요.',
      'string.empty': '비밀번호를 입력해주세요.'
    }),
    author: Joi.string().valid('UR01', 'UR02', 'UR03', 'UR04').allow(null).messages({
      'any.only': 'UR01~UR04의 값만 입력 가능합니다',
      'any.allowOnly': 'UR01~UR04의 값만 입력 가능합니다',
      'string.base': 'string이 아닙니다.',
    }),
    nickname: Joi.string().min(1).empty('').messages({
      'string.empty': 'nickname을 1글자 이상 입력해주세요',
      'string.min': 'nickname을 1글자 이상 입력해주세요',
    }),
  });


module.exports = userSchema;