'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const router = Router;
const searchRouter = router();

searchRouter.get(`/`, async (req, res) => {
  try {
    const {query} = req.query;
    const searchResults = await api.search(query);

    res.render(`search`, {
      searchResults
    });
  } catch (error) {
    res.render(`search`, {
      searchResults: []
    });
  }
});

module.exports = searchRouter;
