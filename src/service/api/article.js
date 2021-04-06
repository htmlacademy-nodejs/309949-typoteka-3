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

  route.get(`/`, async (req, res) => {
    let articles = [];
    const {comments, hot, categoryId} = req.query;
    if (hot) {
      articles = await articleService.findHot();
    } else if (categoryId) {
      articles = await articleService.findAllByCategory(categoryId);
    } else {
      articles = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, keysValidator(articleKeys), async (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [articleExists(articleService), keysValidator(articleKeys)], async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.delete(`/:articleId`, articleExists(articleService), async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    return res.status(HttpCode.OK)
      .json(article);
  });

  // Comments

  route.post(`/:articleId/comments`, [articleExists(articleService), keysValidator(commentKeys)], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(req.body, article);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {commentId} = req.params;
    const {article} = res.locals;
    const comment = await commentService.drop(commentId, article);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment with id ${commentId} not found`);
    }

    return res.status(HttpCode.OK)
      .json(comment);
  });
};
