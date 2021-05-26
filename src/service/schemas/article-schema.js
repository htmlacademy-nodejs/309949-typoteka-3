'use strict';

const Joi = require(`joi`);
const {ServerMessage} = require(`../constants`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ServerMessage.MIN_TITLE_LENGTH,
      'string.max': ServerMessage.MAX_TITLE_LENGTH,
      'any.required': ServerMessage.TITLE_REQUIRED,
    }),

  picture: Joi
    .string()
    .allow(null)
    .optional(),

  createdDate: Joi.string()
    .isoDate()
    .required(),

  categories: Joi.array()
    .items(Joi.number())
    .min(1)
    .required()
    .messages({
      'any.required': ServerMessage.CATEGORIES_REQUIRED,
      'array.base': ServerMessage.CATEGORIES_REQUIRED,
    }),

  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ServerMessage.MIN_ANNOUNCE_LENGTH,
      'string.max': ServerMessage.MAX_ANNOUNCE_LENGTH,
      'any.required': ServerMessage.ANNOUNCE_REQUIRED,
    }),

  fullText: Joi.string()
    .optional()
    .allow(``)
    .max(1000)
    .messages({
      'string.max': ServerMessage.MAX_FULLTEXT_LENGTH,
    }),
});
