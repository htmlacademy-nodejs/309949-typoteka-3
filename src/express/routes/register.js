'use strict';


const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const router = Router;
const registerRouter = router();

const upload = require(`../lib/init-storage`);

registerRouter.get(`/`, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user});
});

registerRouter.post(`/`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : null,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    repeatPassword: body.repeatPassword
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    const errors = error.response.data.messages;
    const {user} = req.session;
    res.render(`sign-up`, {user, errors, userData});
  }
});

module.exports = registerRouter;
