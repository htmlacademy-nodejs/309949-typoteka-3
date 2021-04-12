'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const categoryExists = require(`../middleware/categoryExists`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);

    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:id`, categoryExists(service), async (req, res) => {
    const {id} = req.params;
    const category = await service.findOne(id);
    res.status(HttpCode.OK)
      .json(category);
  });
};
