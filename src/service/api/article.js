'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const articleExists = require(`../middleware/article-exists`);
const commentExists = require(`../middleware/comment-exists`);
const paramsValidator = require(`../middleware/params-validator`);
const validatorMiddleware = require(`../middleware/validator-middleware`);
const articleSchema = require(`../schemas/article-schema`);
const commentSchema = require(`../schemas/comment-schema`);
const {truncate} = require(`../../utils`);

module.exports = (app, articleService, commentService, categoryService) => {
  const route = new Router();
  app.use(`/articles`, route);

  // Articles

  route.get(`/`, async (req, res) => {
    let articles = [];
    const {comments, hot, offset, limit, categoryId} = req.query;

    if (hot) {
      articles = await articleService.findHot();
    } else if (categoryId) {
      articles = await articleService.findAllByCategory({limit, offset, categoryId});
    } else if (limit || offset) {
      articles = await articleService.findPage({limit, offset, comments});
    } else {
      articles = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, [paramsValidator(), articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);
    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, validatorMiddleware(articleSchema), async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [articleExists(articleService), validatorMiddleware(articleSchema)], async (req, res) => {
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

  route.post(`/:articleId/comments`, [articleExists(articleService), validatorMiddleware(commentSchema)], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(req.body, article.id);

    const updatedComment = {...comment.dataValues, text: truncate(comment.dataValues.text, 100, true)};

    const io = req.app.locals.socketio;
    io.emit(`comment:create`, updatedComment);

    const hotArticles = await articleService.findHot();
    const mappedHotArticles = hotArticles.map((item) => {
      return {
        ...item.dataValues,
        announce: truncate(item.dataValues.announce, 100, true),
      };
    });
    const isCommentHot = mappedHotArticles.some((item) => {
      return item.id === article.id
        || Number(item.commentsCount) > Number(comment.dataValues.article.dataValues.commentsCount);
    });

    if (isCommentHot) {
      io.emit(`hotArticles:update`, mappedHotArticles);
    }

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.get(`/:articleId/comments`, [paramsValidator(), articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAllForArticle(articleId);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, [paramsValidator(), articleExists(articleService), commentExists(commentService)], async (req, res) => {
    const {commentId} = req.params;
    const comment = await commentService.drop(commentId);

    return res.status(HttpCode.OK)
      .json(comment);
  });

  // Categories

  route.get(`/:articleId/categories`, [paramsValidator(), articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const categories = await categoryService.findAllForArticle(articleId);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
