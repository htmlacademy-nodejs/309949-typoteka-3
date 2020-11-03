'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);
const api = require(`../api`).getAPI();

const router = Router;
const myRouter = router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {...data, articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  const slicedArticles = articles.slice(0, 3);
  const comments = [];
  await slicedArticles.forEach((article) => {
    article.comments.forEach((comment) => {
      comments.push({...comment, title: article.title, date: article.createdDate});
    });
  });
  res.render(`comments`, {...data, comments});
});
module.exports = myRouter;
