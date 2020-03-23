'use strict';

const express = require(`express`);
const homeRoutes = require(`./routes/home`);
const registerRoutes = require(`./routes/register`);
const loginRoutes = require(`./routes/login`);
const myRoutes = require(`./routes/my`);
const searchRoutes = require(`./routes/search`);
const articlesRoutes = require(`./routes/articles`);
const categoriesRoutes = require(`./routes/categories`);

const {DEFAULT_PORT} = require(`./constants`);

const app = express();

app.use(`/`, homeRoutes);
app.use(`/register`, registerRoutes);
app.use(`/login`, loginRoutes);
app.use(`/my`, myRoutes);
app.use(`/search`, searchRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoriesRoutes);

app.listen(DEFAULT_PORT, () => console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`));
