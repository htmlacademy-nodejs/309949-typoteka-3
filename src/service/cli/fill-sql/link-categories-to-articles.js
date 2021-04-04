'use strict';

const {getRandomInt} = require(`../../../utils`);
const {CategoriesPerArticle} = require(`./constants`);
const {generateItems} = require(`./shared`);

module.exports = (count, categories) => {
  const items = [];
  items.length = count;
  items.fill(null);
  const generateCategoryToArticleLink = (index) => {
    let result = ``;
    const categoriesNum = getRandomInt(CategoriesPerArticle.MIN, CategoriesPerArticle.MAX);
    const categoriesOfArticle = new Set();
    for (let i = CategoriesPerArticle.MIN; i <= categoriesNum; i++) {
      categoriesOfArticle.add(getRandomInt(1, categories.length));
    }
    for (let categoryId of categoriesOfArticle) {
      result = `${result}${result ? `,\n` : ``}(${categoryId}, ${index + 1})`;
    }
    return result;
  };
  return generateItems(items, generateCategoryToArticleLink);
};
