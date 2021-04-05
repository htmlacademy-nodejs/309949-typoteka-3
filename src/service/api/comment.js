'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {latest} = req.query;
    let comments = [];
    if (latest) {
      comments = await service.findLatest();
    }
    res.status(HttpCode.OK)
      .json(comments);
  });
};
