'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, offer) => {
      offer.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());
    return [...categories];
  }
}

module.exports = CategoryService;
