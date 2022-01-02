'use strict';

const express = require(`express`);
const session = require(`express-session`);
const bodyParser = require(`body-parser`);
const homeRoutes = require(`./routes/home`);
const registerRoutes = require(`./routes/register`);
const loginRoutes = require(`./routes/login`);
const logoutRoutes = require(`./routes/logout`);
const myRoutes = require(`./routes/my`);
const searchRoutes = require(`./routes/search`);
const articlesRoutes = require(`./routes/articles`);
const categoriesRoutes = require(`./routes/categories`);
const path = require(`path`);
const {DEFAULT_PORT, PUBLIC_DIR, UPLOAD_DIR} = require(`./constants`);

const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates/pages`));
app.set(`view engine`, `pug`);

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(`/`, homeRoutes);
app.use(`/register`, registerRoutes);
app.use(`/login`, loginRoutes);
app.use(`/logout`, logoutRoutes);
app.use(`/my`, myRoutes);
app.use(`/search`, searchRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoriesRoutes);

app.listen(DEFAULT_PORT, () => console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`));
