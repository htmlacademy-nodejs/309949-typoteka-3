'use strict';

const {Router} = require(`express`);
const router = Router;
const categoriesRouter = router();

categoriesRouter.get(`/`, (req, res) => res.send(`/categories`));

module.exports = categoriesRouter;
