'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../../lib/init-db`);
const category = require(`../../category`);
const DataService = require(`../../../data-service/category`);

const {HttpCode} = require(`../../../constants`);

const mockArticles = require(`../mocks/categoryMockData`);
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
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`Category names are "Железо", "Без рамки", "IT", "Кино"`,
      () => expect(response.body.map((it) => it.name)).toEqual(
          expect.arrayContaining([`Железо`, `Без рамки`, `IT`, `Кино`])
      )
  );
});

describe(`API returns single category`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Category name is "Железо"`,
      () => expect(response.body.name).toEqual(`Железо`));
});

describe(`API returns 404 when category is not found`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories/111`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});
