'use strict';

const {generateItems} = require(`./shared`);

module.exports = (mockCategories) => {
  const generateCategory = (index, category) => {
    return `(${index + 1}, '${category}', NOW())`;
  };
  return generateItems(mockCategories, generateCategory);
};
