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

  async getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  async getHotArticles() {
    return this._load(`/articles`, {params: {hot: true}});
  }

  async getArticlesByCategory({offset, limit, categoryId}) {
    return this._load(`/articles`, {params: {offset, limit, categoryId}});
  }

  async getArticle(id, include) {
    return this._load(`/articles/${id}`, {params: {include}});
  }

  async getArticleComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  async getArticleCategories(id) {
    return this._load(`/articles/${id}/categories`);
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  async createCategory(data) {
    return this._load(`/categories`, {
      method: `POST`,
      data
    });
  }

  async updateCategory(data, id) {
    return this._load(`/categories/${id}`, {
      method: `PUT`,
      data
    });
  }

  async deleteCategory(id) {
    try {
      return await this._load(`/categories/${id}`, {
        method: `DELETE`
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  async updateArticle(data, id) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }

  async getLatestComments() {
    return this._load(`/comments`, {params: {latest: true}});
  }

  async createComment(data, articleId) {
    return this._load(`/articles/${articleId}/comments`, {
      method: `POST`,
      data
    });
  }

  async createUser(data) {
    return this._load(`/user`, {
      method: `POST`,
      data
    });
  }

  async auth(email, password) {
    return this._load(`/user/auth`, {
      method: `POST`,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
