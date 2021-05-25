'use strict';


const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const data = require(`../templates/data`);

const router = Router;
const registerRouter = router();

const upload = require(`../lib/init-storage`);

registerRouter.get(`/`, (req, res) => {
  res.render(`sign-up`, {...data});
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
    res.render(`sign-up`, {...data, errors, userData});
  }
});

module.exports = registerRouter;
