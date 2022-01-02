'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../../lib/init-db`);
const article = require(`../../article`);
const ArticleService = require(`../../../data-service/article`);
const CommentsService = require(`../../../data-service/comment`);
const CategoryService = require(`../../../data-service/category`);

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
  article(app, new ArticleService(mockDB), new CommentsService(mockDB), new CategoryService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article title is "Учим HTML и CSS"`, () => expect(response.body[0].title).toBe(`Учим HTML и CSS`));
  test(`Response to regular request has no nested comments`, () => expect(response.body[0].comments).toBeFalsy());
});

describe(`API returns a list of all articles with comments`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles?comments=true`);
  });
  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Response has nested comments`, () => expect(response.body[0].comments.length).toBe(3));
});

describe(`API returns a list of hot articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles?hot=true`);
  });
  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 hot articles`, () => expect(response.body.length).toBe(4));
  test(`First hot article's title is 'Обзор новейшего смартфона'`,
      () => expect(response.body[0].announce).toBe(`Этот смартфон — настоящая находка.`));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    categories: [1, 2],
    title: `Тест тест, количество символов не менее 30`,
    announce: `Тестирую тестовые данные 1, количество символов не менее 30`,
    fullText: `Полный текст тестовых данных`,
    createdDate: `2020-10-05T18:10:01.000Z`,
    authorId: 1
  };
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Articles count is changed`, async () => await request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  let app;
  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    const newArticle = {
      category: `Тестовое предложение`,
      title: `Тест тест`,
      description: `Тестирую тестовые данные 2`,
      picture: `test.jpg`,
      authorId: 1
    };
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const updatedArticle = {
    categories: [1, 2],
    title: `Обновленный тест, количество символов не менее 30`,
    announce: `Тестирую тестовые данные 2, количество символов не менее 30`,
    fullText: `Полный текст тестовых данных 2`,
    createdDate: `2020-10-05T18:10:01.000Z`,
    authorId: 1
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(updatedArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns true`, () => expect(response.body).toBe(true));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => {
      expect(res.body.title).toBe(`Обновленный тест, количество символов не менее 30`);
    })
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();
  const validArticle = {
    categories: [1, 2],
    title: `Тест`,
    announce: `Тестирую тестовые данные 3`,
    fullText: `Полный текст тестовых данных 3`,
    createdDate: `2020-10-05T18:10:01.000Z`,
    authorId: 1
  };

  return request(app)
    .put(`/articles/123`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid createdDate field`, async () => {
  const app = await createAPI();
  const invalidArticle = {
    categories: [1, 2],
    title: `Не менее 30 символов, Не менее 30 символов`,
    announce: `Не менее 30 символов, Не менее 30 символов`,
    fullText: `нет поля createdDate`,
    authorId: 1
  };

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API returns status code 400 when trying to change an article with empty categories`, async () => {
  const app = await createAPI();
  const invalidArticle = {
    categories: [],
    title: `Не менее 30 символов, Не менее 30 символов`,
    announce: `Не менее 30 символов, Не менее 30 символов`,
    fullText: `категории пустые`,
    createdDate: `2020-10-05T18:10:01.000Z`,
    authorId: 1
  };

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API returns status code 400 when trying to change an article with invalid title`, async () => {
  const app = await createAPI();
  const invalidArticle = {
    categories: [1, 2],
    title: `менее 30 символов`,
    announce: `Не менее 30 символов, Не менее 30 символов`,
    fullText: `Заголовок не подходит`,
    createdDate: `2020-10-05T18:10:01.000Z`,
    authorId: 1
  };

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API returns status code 400 when trying to change an article with invalid announce`, async () => {
  const app = await createAPI();
  const invalidArticle = {
    categories: [1, 2],
    title: `Не менее 30 символов, Не менее 30 символов`,
    announce: `менее 30 символов`,
    fullText: `Анонс не подходит`,
    createdDate: `2020-10-05T18:10:01.000Z`,
    authorId: 1
  };

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API returns status code 400 when trying to change an article with invalid authorId`, async () => {
  const app = await createAPI();
  const invalidArticle = {
    categories: [1, 2],
    title: `Не менее 30 символов, Не менее 30 символов`,
    announce: `Не менее 30 символов, Не менее 30 символов`,
    fullText: `Анонс не подходит`,
    createdDate: `2020-10-05T18:10:01.000Z`,
  };

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/5`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns true`, () => expect(response.body).toBe(true));
  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => {
      expect(res.body.length).toBe(4);
    })
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/123`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment text includes "Мне не нравится ваш стиль."`,
      () => expect(response.body[0].text).toContain(`Мне не нравится ваш стиль.`));
});

test(`API returns status code 404 if article id is invalid`, async () => {
  const app = await createAPI();

  return request(app)
    .get(`/articles/1234/comments`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`,
    authorId: 1
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/1/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment when data is absent, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();
  const newComment = {
    text: `Менее 20 символов`,
    authorId: 1
  };
  return request(app)
    .post(`/articles/1/comments`)
    .send(newComment)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment when authorId is not present, and returns status code 400`, async () => {
  const app = await createAPI();
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  return request(app)
    .post(`/articles/1/comments`)
    .send(newComment)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 2 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1/comments/123`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of categories to one article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`First category is "Железо"`, () => expect(response.body[0].name).toBe(`Железо`));
});

test(`API refuses to return categories to a non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .get(`/articles/123/categories`)
    .expect(HttpCode.NOT_FOUND);
});
