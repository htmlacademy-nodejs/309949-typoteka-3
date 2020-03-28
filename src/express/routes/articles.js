'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);

const router = Router;
const articlesRouter = router();

articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`, {...data});
});
articlesRouter.get(`/add`, (req, res) => {
  res.render(`new-post`, {...data});
});
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
articlesRouter.get(`/:id`, (req, res) => {
  res.render(`post`, {...data, comments: [1], postPicture: true, isInputEmpty: true});
});

module.exports = articlesRouter;
