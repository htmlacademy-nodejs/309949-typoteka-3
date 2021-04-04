'use strict';

const {
  getRandomInt,
  shuffle
} = require(`../../../utils`);

const {generateItems} = require(`./shared`);

module.exports = (count, comments, users) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    let commentsNumber = getRandomInt(2, 5);
    for (let commentId = 1; commentId <= commentsNumber; commentId++) {
      items.push(i);
    }
  }
  const generateComments = (index, articleId) => {
    return `(${index + 1}, \
'${shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)}', \
${getRandomInt(users[0].id, users[1].id)}, \
${articleId}, \
NOW())`;
  };
  return generateItems(items, generateComments);
};
