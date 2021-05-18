'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (service) => async (req, res, next) => {
  const {commentId} = req.params;
  const comment = await service.findOne(commentId);
  if (!comment) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Comment with id ${commentId} not found`);
  }

  res.locals.comment = comment;
  return next();
};
