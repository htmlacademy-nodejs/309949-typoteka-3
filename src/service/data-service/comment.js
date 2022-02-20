'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/aliases`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(comment, articleId) {
    const createdComment = await this._Comment.create({
      articleId,
      ...comment
    });

    return await this._Comment.findByPk(createdComment.id, {
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`password`]
          }
        },
        {
          model: this._Article,
          as: Alias.ARTICLE,
          attributes: {
            include: [
              [Sequelize.literal(`
                  (SELECT COUNT(*) FROM "comments" WHERE "articleId" = "article"."id")
                `),
              `commentsCount`]
            ],
            exclude: [`title`, `fullText`, `picture`, `createdDate`, `createdAt`, `updatedAt`]
          }
        }
      ]
    });
  }

  async findAll() {
    return await this._Comment.findAll({
      order: [[`createdAt`, `DESC`]],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`password`]
          }
        }
      ]
    });
  }

  async findAllForArticle(articleId) {
    return await this._Comment.findAll({
      order: [[`createdAt`, `DESC`]],
      where: {articleId},
      exclude: [`authorId`],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`password`]
          }
        }
      ]
    });
  }

  async findLatest() {
    return await this._Comment.findAll({
      order: [[`createdAt`, `DESC`]],
      limit: 4,
      exclude: [`authorId`],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`password`]
          }
        }
      ]
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
