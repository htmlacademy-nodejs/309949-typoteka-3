'use strict';

const {hash, hashSync, compare} = require(`bcrypt`);

const {SALT_ROUNDS} = require(`../constants`);

module.exports = {
  hash: (password) => hash(password, SALT_ROUNDS),
  hashSync: (password) => hashSync(password, SALT_ROUNDS),
  compare
};
