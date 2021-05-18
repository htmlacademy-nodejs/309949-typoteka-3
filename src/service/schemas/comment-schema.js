'use strict';

const Joi = require(`joi`);
const {ServerMessage} = require(`../constants`);

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.min': ServerMessage.MIN_COMMENT_LENGTH,
      'any.required': ServerMessage.COMMENT_REQUIRED,
      'any.empty': ServerMessage.COMMENT_REQUIRED,
    }),
});
