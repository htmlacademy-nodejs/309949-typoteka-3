'use strict';

const {Router} = require(`express`);

const router = Router;
const categoriesRouter = router();

const api = require(`../api`).getAPI();

const auth = require(`../middlewares/auth`);

categoriesRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories(false);

  res.render(`all-categories`, {user, categories});
});

categoriesRouter.post(`/`, async (req, res) => {
  const {body} = req;
  const {user} = req.session;

  const categoryData = {
    name: body.name
  };

  try {
    await api.createCategory(categoryData);
    const categories = await api.getCategories();

    res.render(`all-categories`, {user, categories});
  } catch (error) {
    const errors = error.response.data.messages;
    const categories = await api.getCategories();

    res.render(`all-categories`, {user, categories, errors});
  }
});

categoriesRouter.post(`/:id`, async (req, res) => {
  const {body: {category, action}} = req;
  const {user} = req.session;
  const {id} = req.params;

  const addCategory = async () => {
    const categoryData = {
      name: category
    };

    try {
      await api.updateCategory(categoryData, id);
      const categories = await api.getCategories();

      res.render(`all-categories`, {user, categories});
    } catch (error) {
      const errors = error.response.data.messages;
      const categories = await api.getCategories();

      res.render(`all-categories`, {user, categories, errors});
    }
  };

  switch (action) {
    case `add`:
      await addCategory();
      break;
  }
});

module.exports = categoriesRouter;
