'use strict';

const {Router} = require(`express`);
const router = Router;
const loginRouter = router();

loginRouter.get(`/`, (req, res) => res.send(`/login`));

module.exports = loginRouter;
