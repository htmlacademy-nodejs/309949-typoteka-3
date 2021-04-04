'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      max: 250
    }
  },
  fullText: DataTypes.TEXT,
  picture: DataTypes.STRING,
  createdDate: DataTypes.DATE
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
