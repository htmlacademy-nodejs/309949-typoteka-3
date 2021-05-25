'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../../lib/init-db`);
const search = require(`../../search`);
const DataService = require(`../../../data-service/search`);
const {TEMPLATE_USERS} = require(`../../../cli/fill-sql/constants`);
const {HttpCode} = require(`../../../constants`);

const mockData = require(`../mocks/searchMockData`);
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const mockCategories = [
  `Железо`,
  `IT`,
  `Кино`,
  `Без рамки`
];

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users: TEMPLATE_USERS});
  search(app, new DataService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Как перестать беспокоиться`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct title`, () => expect(response.body[0].title).toBe(`Как перестать беспокоиться и начать жить`));
});

test(`API returns code 404 if nothing is found`, () => request(app)
    .get(`/search`)
    .query({
      query: `Тестовый запрос`
    })
    .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`, () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);
