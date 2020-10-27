'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);

const category = require(`../../category`);
const DataService = require(`../../../data-service/category`);

const {HttpCode} = require(`../../../constants`);

const mockData = require(`../mocks/categoryMockData`);

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`Category names are "Железо", "Без рамки", "IT", "Кино"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Железо`, `Без рамки`, `IT`, `Кино`])
      )
  );
});
