'use strict';

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);

const Alias = require(`./aliases`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {as: Alias.ARTICLE, foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Alias.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Alias.ARTICLES, onDelete: `restrict`, onUpdate: `restrict`});
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});
  Article.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});

  User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `authorId`});
  Article.belongsTo(User, {as: Alias.USERS, foreignKey: `authorId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `authorId`});
  Comment.belongsTo(User, {as: Alias.USERS, foreignKey: `authorId`});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
