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
  const comments = await api.getAllComments();
  const {user} = req.session;

  res.render(`comments`, {user, comments});
});

myRouter.post(`/comments/:id`, auth, async (req, res) => {
  const {id} = req.params;

  await api.deleteComment(id);

  const comments = await api.getAllComments();
  const {user} = req.session;

  res.render(`comments`, {user, comments});
});

module.exports = myRouter;
