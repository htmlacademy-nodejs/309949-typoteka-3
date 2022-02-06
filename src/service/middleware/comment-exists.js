'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (service) => async (req, res, next) => {
  const {id} = req.params;
  const comment = await service.findOne(id);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Comment with id ${id} not found`);
  }

  res.locals.comment = comment;
  return next();
};
