'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);
const router = Router;
const homeRouter = router();
const api = require(`../api`).getAPI();

homeRouter.get(`/`, async (req, res) => {
  const [articles, hotArticles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getHotArticles(),
    api.getCategories(true)
  ]);
  res.render(`main`, {...data, articles, hotArticles, categories, main: true});
});

module.exports = homeRouter;
