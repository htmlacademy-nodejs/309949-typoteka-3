'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);

const search = require(`../../search`);
const DataService = require(`../../../data-service/search`);

const {HttpCode} = require(`../../../constants`);

const mockData = require(`../mocks/searchMockData`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

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
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(`ckPARY`));
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
