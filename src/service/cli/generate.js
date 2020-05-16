'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  getRandomInt,
  shuffle,
  getRandomDate
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  ExitCode,
  FilePath,
} = require(`../constants`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = date.toLocaleTimeString(`ru-RU`);
  return `${year}-${month.toString().length > 1 ? month : `0${month}`}-${day.toString().length > 1 ? day : `0${day}`} ${time}`;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePosts = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `),
    createdDate: formatDate(getRandomDate(new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date())),
    category: Array.from(shuffle(categories).slice(0, getRandomInt(1, categories.length - 1))),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    if (count > 1000) {
      console.error(chalk.red(`Count exceeded 1000 items. Process exited with exit code ${ExitCode.failure}`));
      process.exit(ExitCode.failure);
    } else {
      try {
        const sentences = await readContent(FilePath.sentences);
        const titles = await readContent(FilePath.titles);
        const categories = await readContent(FilePath.categories);
        const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;
        const comments = await readContent(FilePath.comments);
        const content = JSON.stringify(generatePosts(countPosts, titles, categories, sentences, comments));
        await fs.writeFile(FILE_NAME, content);
        console.info(chalk.green(`Operation successful. File created.`));
      } catch (err) {
        console.error(chalk.red(`Cannot write data to file... Process exited with exit code ${ExitCode.failure}`));
        process.exit(ExitCode.failure);
      }
    }
  }
};
