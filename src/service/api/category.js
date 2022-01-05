'use strict';

const {Router} = require(`express`);
const categoryExists = require(`../middleware/category-exists`);
const paramsValidator = require(`../middleware/params-validator`);
const validatorMiddleware = require(`../middleware/validator-middleware`);
const categorySchema = require(`../schemas/category-schema`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);

    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:id`, [paramsValidator(), categoryExists(service)], async (req, res) => {
    const {id} = req.params;
    const category = await service.findOne(id);
    res.status(HttpCode.OK)
      .json(category);
  });

  route.post(
      `/`,
      [validatorMiddleware(categorySchema)],
      async (req, res) => {
        const category = await service.create(req.body);

        return res.status(HttpCode.CREATED).json(category);
      }
  );

  route.put(`/:id`, [categoryExists(service), validatorMiddleware(categorySchema)], async (req, res) => {
    const {id} = req.params;
    const category = await service.update(id, req.body);

    return res.status(HttpCode.OK)
      .json(category);
  });
};
