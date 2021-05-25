'use strict';

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const article = await this._User.create(userData);
    return article.get();
  }

  async findByEmail(email) {
    return await this._User.findOne({where: {email}});
  }
}

module.exports = UserService;
