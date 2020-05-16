'use strict';

const CategoryService = require(`./category`);
const ArticleService = require(`./article`);
const SearchService = require(`./search`);
const CommentService = require(`./comment`);

module.exports = {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService
};
