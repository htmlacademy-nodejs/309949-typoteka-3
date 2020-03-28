'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);
const router = Router;
const loginRouter = router();

loginRouter.get(`/`, (req, res) => {
  res.render(`login`, {...data, loginErrors: {email: false, password: false}});
});

module.exports = loginRouter;
