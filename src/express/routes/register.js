'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);

const router = Router;
const registerRouter = router();

registerRouter.get(`/`, (req, res) => {
  res.render(`sign-up`, {...data, registerErrors: false});
});

module.exports = registerRouter;
