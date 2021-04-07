'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles(comments) {
    return this._load(`/articles`, {params: {comments}});
  }

  getHotArticles() {
    return this._load(`/articles`, {params: {hot: true}});
  }

  getArticlesByCategory(categoryId) {
    return this._load(`/articles`, {params: {categoryId}});
  }

  getArticle(id, include) {
    return this._load(`/articles/${id}`, {params: {include}});
  }

  getArticleComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  getArticleCategories(id) {
    return this._load(`/articles/${id}/categories`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  getLatestComments() {
    return this._load(`/comments`, {params: {latest: true}});
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
