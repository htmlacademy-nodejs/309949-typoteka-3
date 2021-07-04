'use strict';

const {Router} = require(`express`);

const router = Router;
const categoriesRouter = router();

const auth = require(`../middlewares/auth`);

categoriesRouter.get(`/`, auth, (req, res) => {
  const {user} = req.session;
  res.render(`all-categories`, {user});
});

module.exports = categoriesRouter;
