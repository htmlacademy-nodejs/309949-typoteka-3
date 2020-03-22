'use strict';

const {Router} = require(`express`);
const router = Router;
const searchRouter = router();

searchRouter.get(`/`, (req, res) => res.send(`/search`));

module.exports = searchRouter;
