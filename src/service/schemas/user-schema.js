'use strict';

const Joi = require(`joi`);
const {ServerMessage, REGEX_ALPHA} = require(`../constants`);

module.exports = Joi.object({
  firstName: Joi.string()
    .required()
    .pattern(REGEX_ALPHA)
    .messages({
      'string.pattern.base': ServerMessage.ALPHA_PATTERN,
      'any.required': ServerMessage.FIRST_NAME_REQUIRED,
    }),
  lastName: Joi.string()
    .required()
    .pattern(REGEX_ALPHA)
    .messages({
      'string.pattern.base': ServerMessage.ALPHA_PATTERN,
      'any.required': ServerMessage.LAST_NAME_REQUIRED,
    }),
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.email': ServerMessage.IS_EMAIL,
      'any.required': ServerMessage.EMAIL_REQUIRED,
    }),
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.min': ServerMessage.PASSWORD_LENGTH,
      'any.required': ServerMessage.PASSWORD_REQUIRED,
    }),
  repeatPassword: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .messages({
      'any.only': ServerMessage.REPEAT_EQUAL,
      'any.required': ServerMessage.REPEAT_REQUIRED,
    }),
  avatar: Joi
    .string()
    .allow(null)
    .optional(),
});
