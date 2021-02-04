'use strict';

module.exports = (tableName, values) => `INSERT INTO ${tableName} VALUES\n${values}\nON CONFLICT DO NOTHING;`;
