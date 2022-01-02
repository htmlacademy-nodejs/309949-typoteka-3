'use strict';

module.exports = (req, res, next) => {

  const {user} = req.session;

  if (!user || !user.isAdmin) {
    return res.redirect(`/login`);
  }
  return next();
};
