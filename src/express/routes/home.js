'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);
const router = Router;
const homeRouter = router();


homeRouter.get(`/`, (req, res) => {
  res.render(`main`, {...data, main: true});
});

module.exports = homeRouter;
