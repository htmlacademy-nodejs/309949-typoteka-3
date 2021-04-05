'use strict';

const {QueryTypes} = require(`sequelize`);
const sequelizeInstance = require(`../lib/sequelize`);
const Alias = require(`../models/aliases`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
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

  findOne(id) {
    return this._Article.findByPk(id, {include: [Alias.CATEGORIES]});
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
