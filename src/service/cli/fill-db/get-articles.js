'use strict';

const {
  getRandomInt,
  shuffle
} = require(`../../../utils`);

const {TEMPLATE_USERS} = require(`./constants`);
const {generateItems} = require(`./shared`);

module.exports = (count, titles, sentences) => {
  const items = [];
  items.length = count;
  items.fill(null);
  const generateArticle = (index) => {
    return `(${index + 1}, \
'${titles[getRandomInt(0, titles.length - 1)]}', \
'${shuffle(sentences).slice(1, 5).join(` `)}', \
'${shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `)}', \
NULL, \
${getRandomInt(TEMPLATE_USERS[0].id, TEMPLATE_USERS[1].id)}, \
NOW())`;
  };
  return generateItems(items, generateArticle);
};
