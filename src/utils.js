'use strict';

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

module.exports.readContent = async (fs, chalk, filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports.truncate = (str, n, useWordBoundary) => {
  if (str.length <= n) {
    return str;
  }
  const subString = str.substring(0, n - 1).trim();
  return `${(useWordBoundary
    ? subString.substring(0, (subString.lastIndexOf(``)))
    : subString)}${subString.endsWith(`.`) ? `` : `...`}`;
};
