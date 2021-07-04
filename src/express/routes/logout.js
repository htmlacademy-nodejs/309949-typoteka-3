'use strict';

const {Router} = require(`express`);
const router = Router;
const logoutRouter = router();

logoutRouter.get(`/`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

module.exports = logoutRouter;

