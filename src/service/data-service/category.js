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
                `*`
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
    const category = await this._Category.findOne({where: {id}});
    return category;
  }
}

module.exports = CategoryService;
