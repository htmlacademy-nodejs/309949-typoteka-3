'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../../lib/init-db`);
const user = require(`../../user`);
const UserService = require(`../../../data-service/user`);

const {HttpCode} = require(`../../../constants`);
const {TEMPLATE_USERS} = require(`../../../cli/fill-sql/constants`);

const mockData = require(`../mocks/articleMockData`);
const mockCategories = [
  `Железо`,
  `IT`,
  `Кино`,
  `Без рамки`
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users: TEMPLATE_USERS});
  const app = express();
  app.use(express.json());
  user(app, new UserService(mockDB));
  return app;
};

describe(`API creates a user if data is valid`, () => {
  const newUser = {
    avatar: null,
    firstName: `Василий`,
    lastName: `Smith`,
    email: `vsmith@gmail.com`,
    password: `123456`,
    repeatPassword: `123456`
  };
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send(newUser);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create a user if data is invalid`, () => {
  let app;
  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    const newUser = {
      firstName: `Василий`,
      lastName: `Smith`,
      email: `vsmith@gmail.com`,
      password: `123456`,
      repeatPassword: `123456`
    };
    for (const key of Object.keys(newUser)) {
      const badUser = {...newUser};
      delete badUser[key];
      await request(app)
        .post(`/user`)
        .send(badUser)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When first name includes numbers and special characters response code is 400`, async () => {
    const badUser = {
      firstName: `__123Василий321__`,
      lastName: `Smith`,
      email: `vsmith@gmail.com`,
      password: `123456`,
      repeatPassword: `123456`
    };
    await request(app)
      .post(`/user`)
      .send(badUser)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When last name includes numbers and special characters response code is 400`, async () => {
    const badUser = {
      firstName: `Василий`,
      lastName: `__123Smith321__`,
      email: `vsmith@gmail.com`,
      password: `123456`,
      repeatPassword: `123456`
    };
    await request(app)
      .post(`/user`)
      .send(badUser)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is invalid response code is 400`, async () => {
    const badUser = {
      firstName: `Василий`,
      lastName: `Smith`,
      email: `vsmith@gmail`,
      password: `123456`,
      repeatPassword: `123456`
    };
    await request(app)
      .post(`/user`)
      .send(badUser)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When users email exists response code is 400`, async () => {
    const badUser = {
      firstName: `Василий`,
      lastName: `Smith`,
      email: TEMPLATE_USERS[0].email,
      password: `123456`,
      repeatPassword: `123456`
    };
    await request(app)
      .post(`/user`)
      .send(badUser)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When password has less than 6 chars response code is 400`, async () => {
    const badUser = {
      firstName: `Василий`,
      lastName: `Smith`,
      email: TEMPLATE_USERS[0].email,
      password: `12345`,
      repeatPassword: `12345`
    };
    await request(app)
      .post(`/user`)
      .send(badUser)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When passwords do not match response code is 400`, async () => {
    const badUser = {
      firstName: `Василий`,
      lastName: `Smith`,
      email: TEMPLATE_USERS[0].email,
      password: `123456`,
      repeatPassword: `123456f`
    };
    await request(app)
      .post(`/user`)
      .send(badUser)
      .expect(HttpCode.BAD_REQUEST);
  });
});
