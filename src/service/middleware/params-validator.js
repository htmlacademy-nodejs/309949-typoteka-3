'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../constants`);

const schema = Joi.number();

module.exports = () => (
  async (req, res, next) => {
    const {articleId, commentId, categoryId} = req.params;
    const paramsArray = [articleId, commentId, categoryId].filter((item) => item);

    for (let item of paramsArray) {
      try {
        await schema.validateAsync(item);
      } catch (error) {
        res.status(HttpCode.NOT_FOUND)
          .send(`Id ${item} is not a number`);
        return;
      }
    }

    next();
  }
);
