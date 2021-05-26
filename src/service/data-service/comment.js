'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(comment, articleId) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async findAll() {
    return await this._Comment.findAll({
      raw: true
    });
  }

  async findAllForArticle(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findLatest() {
    return await this._Comment.findAll({
      order: [[`createdAt`, `DESC`]],
      limit: 4
    });
  }

  async findOne(id) {
    return await this._Comment.findByPk(id);
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
