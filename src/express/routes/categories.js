'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);

const router = Router;
const categoriesRouter = router();

categoriesRouter.get(`/`, (req, res) => {
  res.render(`all-categories`, {...data});
});

module.exports = categoriesRouter;
