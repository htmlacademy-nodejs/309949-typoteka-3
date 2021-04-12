'use strict';

const {Op} = require(`sequelize`);
const Alias = require(`../models/aliases`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Alias.CATEGORIES],
    });
    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
