'use strict';

const {Router} = require(`express`);
const data = require(`../templates/data`);

const router = Router;
const myRouter = router();

myRouter.get(`/`, (req, res) => {
  res.render(`my`, {...data});
});
myRouter.get(`/comments`, (req, res) => {
  res.render(`comments`, {...data});
});
module.exports = myRouter;
