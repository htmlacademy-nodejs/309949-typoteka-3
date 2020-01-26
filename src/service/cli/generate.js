'use strict';

const fs = require(`fs`);

const {
  getRandomInt,
  shuffle,
  getRandomDate
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  TITLES,
  SENTENCES,
  CATEGORIES,
} = require(`../cli/constants`);

const {
  ExitCode
} = require(`../../constants`);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = date.toLocaleTimeString('ru-RU');
  return `${year}-${month.toString().length > 1 ? month : `0${month}`}-${day.toString().length > 1 ? day : `0${day}`} ${time}`
};

const generatePosts = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    announce: shuffle(SENTENCES).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(SENTENCES).slice(0, getRandomInt(1, SENTENCES.length - 1)).join(` `),
    createdDate: formatDate(getRandomDate(new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date())),
    category: Array.from(shuffle(CATEGORIES).slice(0, getRandomInt(1, CATEGORIES.length - 1))),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePosts(countPosts));
    if (count > 1000) {
      console.error(`Count exceeded 1000 items. Process exited with exit code ${ExitCode.failure}`);
      process.exit(ExitCode.failure);
    } else {
      fs.writeFile(FILE_NAME, content, (err) => {
        if (err) {
          console.error(`Cannot write data to file... Process exited with exit code ${ExitCode.failure}`);
          process.exit(ExitCode.failure);
        }
        return console.info(`Operation successful. File created.`);
      });
    }
  }
};
