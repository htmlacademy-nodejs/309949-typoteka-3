'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);

class CommentService {

  create(comment, article) {
    const {text} = comment;

    article.comments = [...article.comments, {id: nanoid(MAX_ID_LENGTH), text}];
    return article;
  }

  findAll(article) {
    return article.comments || [];
  }

  drop(id, article) {
    if (!article) {
      return null;
    }
    const comment = article.comments.find((item) => item.id === id);
    article.comments = article.comments.filter((item) => item.id !== id);
    return comment;
  }
}

module.exports = CommentService;
