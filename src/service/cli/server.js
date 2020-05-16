'use strict';

const express = require(`express`);
const chalk = require(`chalk`);

const routes = require(`../api`);

const {API_PREFIX, DEFAULT_PORT} = require(`../constants`);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(API_PREFIX, routes);

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    if (port > 0 && port <= 65535) {
      app.listen(DEFAULT_PORT, () => console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`));
    } else {
      console.error(chalk.red(`Please enter port number between 1 and 65535`));
    }
  }
};
