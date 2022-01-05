'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const router = Router;
const myRouter = router();

const auth = require(`../middlewares/auth`);

myRouter.get(`/`, auth, async (req, res) => {
  const articles = await api.getArticles({});
  const {user} = req.session;
  res.render(`my`, {user, articles});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const slicedArticles = articles.slice(0, 3);
  const comments = [];
  await slicedArticles.forEach((article) => {
    article.comments.forEach((comment) => {
      comments.push({...comment, title: article.title, date: article.createdDate});
    });
  });
  const {user} = req.session;
  res.render(`comments`, {user, comments});
});

module.exports = myRouter;
