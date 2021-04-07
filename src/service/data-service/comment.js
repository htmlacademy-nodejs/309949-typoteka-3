'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  findAll() {
    return this._Comment.findAll({
      raw: true
    });
  }

  findAllForArticle(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  findLatest() {
    return this._Comment.findAll({
      order: [[`createdAt`, `DESC`]],
      limit: 4
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
