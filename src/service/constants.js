'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.DEFAULT_COUNT = 1;
module.exports.FILE_NAME = `mocks.json`;
module.exports.DEFAULT_PORT = 3000;
module.exports.MAX_ID_LENGTH = 6;
module.exports.MAX_COMMENTS = 4;
module.exports.API_PREFIX = `/api`;
module.exports.MOCK_PICTURES = [`forest.jpg`, `sea.jpg`, `skyscraper.jpg`];
module.exports.SALT_ROUNDS = 10;
module.exports.REGEX_ALPHA = /^[a-zа-яё]*$/miu;

module.exports.ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
};

module.exports.FilePath = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports.ServerMessage = {
  MIN_TITLE_LENGTH: `Количество символов поля «Заголовок» должно быть не менее 30`,
  MAX_TITLE_LENGTH: `Количество символов поля «Заголовок» должно быть не более 250`,
  TITLE_REQUIRED: `Заполните поле «Заголовок»`,
  CATEGORIES_REQUIRED: `Выберите минимум одну категорию`,
  MIN_ANNOUNCE_LENGTH: `Количество символов поля «Анонс» должно быть не менее 30`,
  MAX_ANNOUNCE_LENGTH: `Количество символов поля «Анонс» должно быть не более 250`,
  ANNOUNCE_REQUIRED: `Заполните поле «Анонс»`,
  MAX_FULLTEXT_LENGTH: `Количество символов поля «Полный текст публикации» должно быть не более 1000`,
  MIN_COMMENT_LENGTH: `Количество символов в комментарии должно быть не менее 20`,
  COMMENT_REQUIRED: `Комментарий не может быть пустым`,
  ALPHA_PATTERN: `Вводите только буквы`,
  FIRST_NAME_REQUIRED: `Заполните поле «Имя»`,
  LAST_NAME_REQUIRED: `Заполните поле «Имя»`,
  IS_EMAIL: `Введите валидный адрес электронной почты`,
  EMAIL_REQUIRED: `Заполните поле «Электронная почта»`,
  PASSWORD_LENGTH: `Количество символов поля «Пароль» должно быть не менее 6`,
  PASSWORD_REQUIRED: `Введите пароль`,
  REPEAT_REQUIRED: `Повторно введите пароль`,
  REPEAT_EQUAL: `Пароли должны совпадать`,
};
