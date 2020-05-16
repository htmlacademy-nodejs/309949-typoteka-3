'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(query) {
    return this._articles.filter((article) => article.title.toLowerCase().includes(query.toLowerCase()));
  }
}

module.exports = SearchService;
