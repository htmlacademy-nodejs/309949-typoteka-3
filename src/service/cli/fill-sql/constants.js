'use strict';

module.exports.MAX_ARTICLES = 100;
module.exports.FILE_NAME = `fill-db.sql`;
module.exports.CategoriesPerArticle = {
  MAX: 4,
  MIN: 1
};
module.exports.TEMPLATE_USERS = [
  {id: 1, firstName: `Анна`, lastName: `Михайлова`, email: `mikhaylova@mail.ru`, password: `123456`, avatar: null},
  {id: 2, firstName: `Пётр`, lastName: `Петров`, email: `petrovp@yandex.ru`, password: `123456`, avatar: null}
];
