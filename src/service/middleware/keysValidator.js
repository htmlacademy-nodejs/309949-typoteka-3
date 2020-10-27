'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (bodyKeys) => (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = bodyKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
    return null;
  }

  next();
  return null;
};
