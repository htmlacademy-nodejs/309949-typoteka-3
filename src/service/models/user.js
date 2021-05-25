'use strict';

const {DataTypes, Model} = require(`sequelize`);
const bcrypt = require(`bcrypt`);
const {SALT_ROUNDS} = require(`../constants`);

class User extends Model {}

const define = (sequelize) => User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 6,
    }
  },
  avatar: DataTypes.STRING,
  isAdmin: DataTypes.BOOLEAN
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
      const count = await User.count();
      user.isAdmin = count === 0;
    },
    // Для консольной утилиты filldb
    beforeBulkCreate: async (users) => {
      for (let [index, user] of users.entries()) {
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.isAdmin = index === 0;
      }
    },
  },
});

module.exports = define;
