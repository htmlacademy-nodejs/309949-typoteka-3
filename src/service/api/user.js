'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const validatorMiddleware = require(`../middleware/validator-middleware`);
const userSchema = require(`../schemas/user-schema`);
const userExists = require(`../middleware/user-exists`);
const passwordUtils = require(`../lib/password`);

module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, [validatorMiddleware(userSchema), userExists(userService)], async (req, res) => {
    const article = await userService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await userService.findByEmail(email);

    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).send(`E-mail or password is incorrect`);
      return;
    }

    const passwordIsCorrect = await passwordUtils.compare(password, user.password);
    if (passwordIsCorrect) {
      delete user.password;
      res.status(HttpCode.OK).json(user);
    } else {
      res.status(HttpCode.UNAUTHORIZED).send(`E-mail or Password is incorrect`);
    }
  });
};
