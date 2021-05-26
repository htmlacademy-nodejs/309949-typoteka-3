'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;

    try {
      await schema.validateAsync(body, {abortEarly: false});
    } catch (err) {
      const {details} = err;
      res.status(HttpCode.BAD_REQUEST).json({
        messages: details.map((errorDescription) => {
          return {
            message: errorDescription.message,
            path: errorDescription.path
          };
        }),
        data: body
      });
      return;
    }

    next();
  }
);
