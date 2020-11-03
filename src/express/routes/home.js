'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);
const router = Router;
const homeRouter = router();
const api = require(`../api`).getAPI();

homeRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {...data, articles, main: true});
});

module.exports = homeRouter;
