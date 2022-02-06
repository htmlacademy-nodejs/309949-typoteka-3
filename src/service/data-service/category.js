'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/aliases`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Alias.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  async findAllForArticle(articleId) {
    const result = await this._Category.findAll({
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.literal(`
                (SELECT COUNT(*) FROM "ArticleCategories" WHERE "CategoryId" = "Category"."id")
              `),
          `count`
        ]
      ],
      group: [`Category.id`, `articleCategories.CategoryId`, `articleCategories.ArticleId`],
      include: [{
        model: this._ArticleCategory,
        as: Alias.ARTICLE_CATEGORIES,
        attributes: [`ArticleId`],
        where: {"ArticleId": articleId},
      }]
    });
    return result.map((it) => it.get());
  }

  async findOne(id) {
    return await this._Category.findOne({where: {id}});
  }

  async create(category) {
    return await this._Category.create(category);
  }

  async update(id, category) {
    const affectedRows = await this._Category.update(category, {
      where: {id}
    });
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CategoryService;
