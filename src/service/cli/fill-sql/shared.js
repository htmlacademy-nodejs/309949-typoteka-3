'use strict';

module.exports.generateItems = (templateItems, generateItem) => {
  let result = ``;
  for (let [index, item] of templateItems.entries()) {
    if (index === 0) {
      result = `${generateItem(index, item)},`;
    } else {
      result = `${result}\n${generateItem(index, item)}${templateItems.length - 1 === index ? `` : `,`}`;
    }
  }
  return `${result}`;
};
