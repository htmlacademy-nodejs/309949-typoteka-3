'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const logger = getLogger({});

const {
  getRandomInt,
  getRandomDate,
  readContent,
  shuffle,
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  MAX_COMMENTS,
  MOCK_PICTURES,
  FilePath,
  ExitCode
} = require(`../constants`);

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const getPictureFileName = (num) => {
  return num > 2 ? null : MOCK_PICTURES[num];
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = date.toLocaleTimeString(`ru-RU`);
  return `${year}-${month.toString().length > 1 ? month : `0${month}`}-${day.toString().length > 1 ? day : `0${day}`} ${time}`;
};

const generatePosts = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, getRandomInt(1, 3)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `),
    picture: getPictureFileName(getRandomInt(0, 3)),
    createdDate: formatDate(getRandomDate(new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date())),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [count] = args;

    if (count > 1000) {
      logger.error(chalk.red(`Count exceeded 1000 items. Process exited with exit code ${ExitCode.FAILURE}`));
      process.exit(ExitCode.FAILURE);
    } else {
      try {
        logger.info(`Trying to connect to database...`);
        await sequelize.authenticate();
      } catch (err) {
        logger.error(`An error occured: ${err.message}`);
        process.exit(1);
      }
      logger.info(`Connection to database established`);

      const sentences = await readContent(fs, chalk, FilePath.SENTENCES);
      const titles = await readContent(fs, chalk, FilePath.TITLES);
      const categories = await readContent(fs, chalk, FilePath.CATEGORIES);
      const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;
      const comments = await readContent(fs, chalk, FilePath.COMMENTS);

      const articles = generatePosts(countPosts, titles, categories, sentences, comments);
      return initDatabase(sequelize, {categories, articles});
    }
    return null; // consistent return
  }
};
