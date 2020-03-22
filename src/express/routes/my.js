'use strict';

const {Router} = require(`express`);
const router = Router;
const myRouter = router();

myRouter.get(`/`, (req, res) => res.send(`/my`));
myRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));

module.exports = myRouter;
