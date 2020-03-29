'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  DEFAULT_PORT,
  FILE_NAME,
  HttpCode
} = require(`../cli/constants`);

const app = express();
app.use(express.json());
app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    console.log(`We've got an error here, probably file is nonexistent or empty: ${err}`);
    res.json([]);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

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
