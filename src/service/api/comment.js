'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const commentExists = require(`../middleware/comment-exists`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {latest} = req.query;
    let comments = [];
    if (latest) {
      comments = await service.findLatest();
    } else {
      comments = await service.findAll();
    }
    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:id`, [commentExists(service)], async (req, res) => {
    const {id} = req.params;

    try {
      const comment = await service.drop(id);

      return res.status(HttpCode.OK)
        .json(comment);
    } catch (error) {
      return res.status(HttpCode.BAD_REQUEST)
        .json(error);
    }
  });
};
