'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (bodyKeys) => (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = bodyKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
    return null;
  }

  next();
  return null;
};
