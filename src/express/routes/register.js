'use strict';

const {Router} = require(`express`);
const router = Router;
const registerRouter = router();

registerRouter.get(`/`, (req, res) => res.send(`/register`));

module.exports = registerRouter;
