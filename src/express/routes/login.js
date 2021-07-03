'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);
const router = Router;
const loginRouter = router();

const api = require(`../api`).getAPI();

loginRouter.get(`/`, (req, res) => {
  const {error} = req.query;
  res.render(`login`, {...data, error});
});

loginRouter.post(`/`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    res.redirect(`/`);
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = loginRouter;
