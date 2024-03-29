'use strict';

const express = require(`express`);
const routes = require(`../api`);

const sequelize = require(`../lib/sequelize`);

const {API_PREFIX, DEFAULT_PORT, HttpCode} = require(`../constants`);
const {getLogger} = require(`../lib/logger`);

const http = require(`http`);
const socket = require(`../lib/socket`);

const app = express();
const server = http.createServer(app);

const io = socket(server);
app.locals.socketio = io;

const logger = getLogger({name: `api`});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      logger.info(`Connecting to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }

    logger.info(`Connection to database established`);

    try {
      server.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occurred on server creation: ${err.message}`);
        }
        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  }
};
