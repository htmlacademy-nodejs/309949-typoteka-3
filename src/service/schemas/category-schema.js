'use strict';

const Joi = require(`joi`);
const {ServerMessage} = require(`../constants`);

module.exports = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      'string.min': ServerMessage.MIN_CATEGORY_LENGTH,
      'string.max': ServerMessage.MAX_CATEGORY_LENGTH,
    })
});
