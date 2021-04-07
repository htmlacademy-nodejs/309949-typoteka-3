'use strict';

const {QueryTypes} = require(`sequelize`);
const Sequelize = require(`sequelize`);
const sequelizeInstance = require(`../lib/sequelize`);
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
    const result = await sequelizeInstance.query(`
      SELECT a.id, a.announce, COUNT(c.id) as commentsCount FROM articles a
      LEFT OUTER JOIN comments c ON a.id = c."articleId"
      GROUP BY a.id
      ORDER BY commentsCount DESC
      LIMIT 4;
    `, {type: QueryTypes.SELECT});
    return result;
  }

  async findOne(id, includes = {categories: false, comments: false}) {
    const {categories, comments} = includes;
    const include = [];
    if (comments) {
      include.push(Alias.COMMENTS);
    }
    if (categories) {
      include.push({
        model: this._Category,
        as: Alias.CATEGORIES,
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.literal(`
                (SELECT COUNT(*) FROM "ArticleCategories" WHERE "CategoryId" = "categories"."id")
              `),
            `count`
          ]
        ],
      });
    }
    const article = await this._Article.findByPk(id, {
      include,
    }
    );
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
