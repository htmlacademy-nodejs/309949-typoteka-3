'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (service) => async (req, res, next) => {
  const {id} = req.params;
  const category = await service.findOne(id);

  if (!category) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Article with id ${id} not found`);
  }

  res.locals.category = category;
  return next();
};
