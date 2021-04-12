'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/aliases`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];
    if (needComments) {
      include.push(Alias.COMMENTS);
    }
    const articles = await this._Article.findAll({include});
    return articles.map((item) => item.get());
  }

  async findAllByCategory(categoryId) {
    const articles = await this._Article.findAll({
      where: {
        '$articleCategories.CategoryId$': categoryId
      },
      include: [
        {model: this._ArticleCategory, as: Alias.ARTICLE_CATEGORIES},
        Alias.CATEGORIES,
        Alias.COMMENTS
      ]
    });
    return articles;
  }

  async findHot() {
    const result = await this._Article.findAll({
      attributes: {
        include: [
          [Sequelize.literal(`
                  (SELECT COUNT(*) FROM "comments" WHERE "articleId" = "Article"."id")
                `),
          `commentsCount`]
        ],
        exclude: [`title`, `fullText`, `picture`, `createdDate`, `createdAt`, `updatedAt`]
      },
      order: [[Sequelize.literal(`"commentsCount"`), `DESC`]],
      limit: 4
    });
    return result;
  }

  async findOne(id) {
    const article = await this._Article.findByPk(id);
    return article;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = ArticleService;
