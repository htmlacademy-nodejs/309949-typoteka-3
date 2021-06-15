'use strict';

const CategoryService = require(`./category`);
const ArticleService = require(`./article`);
const SearchService = require(`./search`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);

module.exports = {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService
};
