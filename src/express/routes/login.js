'use strict';

const {Router} = require(`express`);
const router = Router;
const loginRouter = router();

const api = require(`../api`).getAPI();

loginRouter.get(`/`, (req, res) => {
  const {error} = req.query;
  const {user} = req.session;
  res.render(`login`, {user, error});
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

loginRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

module.exports = loginRouter;
