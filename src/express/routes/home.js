'use strict';

const {Router} = require(`express`);
const {OFFERS_PER_PAGE} = require(`../constants`);

const router = Router;
const homeRouter = router();
const api = require(`../api`).getAPI();

homeRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, articles}, hotArticles, latestComments, categories] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getHotArticles(),
    api.getLatestComments(),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  const {user} = req.session;

  res.render(`main`, {user, articles, hotArticles, latestComments, categories, main: true, totalPages, page});
});

module.exports = homeRouter;
