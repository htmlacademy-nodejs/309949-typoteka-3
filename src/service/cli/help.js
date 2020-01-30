'use strict';
const chalk = require(`chalk`);

const info = `
Программа запускает http-сервер и формирует файл с данными для API.

  Гайд:
  server <command>
  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --generate <count>    формирует файл mocks.json
`;

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(info));
  }
};
