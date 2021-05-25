'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const validatorMiddleware = require(`../middleware/validator-middleware`);
const userSchema = require(`../schemas/user-schema`);
const userExists = require(`../middleware/user-exists`);

module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, [validatorMiddleware(userSchema), userExists(userService)], async (req, res) => {
    const article = await userService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });
};
