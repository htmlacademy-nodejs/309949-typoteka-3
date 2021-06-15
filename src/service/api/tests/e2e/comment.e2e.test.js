'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../../lib/init-db`);
const comment = require(`../../comment`);
const DataService = require(`../../../data-service/comment`);
const {TEMPLATE_USERS} = require(`../../../cli/fill-sql/constants`);
const {HttpCode} = require(`../../../constants`);

const mockArticles = require(`../mocks/commentMockData`);
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const mockCategories = [
  `Железо`,
  `Без рамки`,
  `IT`,
];

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: TEMPLATE_USERS});
  comment(app, new DataService(mockDB));
});

describe(`API returns comments list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 comments`, () => expect(response.body.length).toBe(5));
  test(`First comment text is 'Согласен с автором!'`,
      () => expect(response.body[0].text).toBe(`Согласен с автором!`)
  );
});

describe(`API returns 4 latest comments`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/comments?latest=true`);
  });

  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));
  test(`Latest comment text is 'Плюсую, но слишком много буквы!'`,
      () => expect(response.body[0].text).toBe(`Плюсую, но слишком много буквы!`)
  );
});
