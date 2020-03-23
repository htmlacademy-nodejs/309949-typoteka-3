'use strict';

const {Router} = require(`express`);
const router = Router;
const homeRouter = router();

homeRouter.get(`/`, (req, res) => res.send(`/`));

module.exports = homeRouter;
