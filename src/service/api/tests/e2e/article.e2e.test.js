'use strict';

const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);

const article = require(`../../article`);
const DataService = require(`../../../data-service/article`);
const CommentsService = require(`../../../data-service/comment`);

const {HttpCode} = require(`../../../constants`);

const mockData = require(`../mocks/articleMockData`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article id is "jct_0G"`, () => expect(response.body[0].id).toBe(`jct_0G`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/jct_0G`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    category: `Тестовое предложение`,
    title: `Тест тест`,
    announce: `Тестирую тестовые данные 1`,
    fullText: `Полный текст тестовых данных`,
    createdDate: `2020-10-05 21:10:01`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns created article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    const newArticle = {
      category: `Тестовое предложение`,
      title: `Тест тест`,
      description: `Тестирую тестовые данные 2`,
      picture: `test.jpg`,
      type: `OFFER`,
      sum: 1934
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
    category: `Тестовое предложение`,
    title: `Обновленный тест`,
    announce: `Тестирую тестовые данные 2`,
    fullText: `Полный текст тестовых данных 2`,
    createdDate: `2020-10-05 21:10:02`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/nfjioS`)
      .send(updatedArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(updatedArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/nfjioS`)
    .expect((res) => {
      expect(res.body.title).toBe(`Обновленный тест`);
    })
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();
  const validArticle = {
    category: `Тестовое предложение`,
    title: `Тест`,
    announce: `Тестирую тестовые данные 3`,
    fullText: `Полный текст тестовых данных 3`,
    createdDate: `2020-10-05 21:10:02`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();
  const invalidArticle = {
    category: `Тестовое предложение`,
    title: `Тест`,
    announce: `Тестирую тестовые данные 3`,
    fullText: `нет поля createdDate`
  };

  return request(app)
    .put(`/articles/nfjioS`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/U_Llq7`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`U_Llq7`));
  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => {
      expect(res.body.length).toBe(4);
    })
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/U_Llq7/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment id is "6u3TwP"`, () => expect(response.body[0].id).toBe(`6u3TwP`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/U_Llq7/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/U_Llq7/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/1BABmS/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/1BABmS/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/1BABmS/comments/8X9xwB`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`8X9xwB`));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/1BABmS/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});
