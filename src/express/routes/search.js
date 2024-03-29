'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const router = Router;
const searchRouter = router();

searchRouter.get(`/`, async (req, res) => {
  const {query} = req.query;
  const {user} = req.session;
  try {
    let searchResults = [];

    if (query) {
      searchResults = await api.search(query);
    }

    res.render(`search`, {
      user,
      searchResults,
      plainBackground: true,
      query
    });
  } catch (error) {
    res.render(`search`, {
      user,
      searchResults: [],
      plainBackground: true,
      query,
      notFound: true
    });
  }
});

module.exports = searchRouter;
