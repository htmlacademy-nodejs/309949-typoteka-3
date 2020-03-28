'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);

const router = Router;
const searchRouter = router();

searchRouter.get(`/`, (req, res) => {
  res.render(`search`, {...data, searchResult: [1]});
});

module.exports = searchRouter;
