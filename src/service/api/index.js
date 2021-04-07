'use strict';

const {Router} = require(`express`);

const category = require(`./category`);
const article = require(`./article`);
const comment = require(`./comment`);
const search = require(`./search`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const app = new Router();
defineModels(sequelize);

(async () => {
  category(app, new CategoryService(sequelize));
  comment(app, new CommentService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize), new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
