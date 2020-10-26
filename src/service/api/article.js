'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const keysValidator = require(`../middleware/keysValidator`);
const articleExists = require(`../middleware/articleExists`);

const articleKeys = [`category`, `title`, `createdDate`, `announce`];
const commentKeys = [`text`];

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  // Articles

  route.post(`/`, keysValidator(articleKeys), (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.put(`/:articleId`, [articleExists(articleService), keysValidator(articleKeys)], (req, res) => {
    const {articleId} = req.params;
    const article = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.delete(`/:articleId`, articleExists(articleService), (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    return res.status(HttpCode.OK)
      .json(article);
  });

  // Comments

  route.post(`/:articleId/comments`, [articleExists(articleService), keysValidator(commentKeys)], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(req.body, article);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), (req, res) => {
    const {commentId} = req.params;
    const {article} = res.locals;
    const comment = commentService.drop(commentId, article);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment with id ${commentId} not found`);
    }

    return res.status(HttpCode.OK)
      .json(comment);
  });
};
