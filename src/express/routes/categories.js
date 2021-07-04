'use strict';

const {Router} = require(`express`);

const router = Router;
const categoriesRouter = router();

categoriesRouter.get(`/`, (req, res) => {
  const {user} = req.session;
  res.render(`all-categories`, {user});
});

module.exports = categoriesRouter;
