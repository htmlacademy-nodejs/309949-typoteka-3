'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const api = require(`../api`).getAPI();
const {OFFERS_PER_PAGE} = require(`../constants`);

const router = Router;
const articlesRouter = router();

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);

const csrfProtection = csrf();

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;

  let {page = 1} = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  try {
    const [headCategory, categories, {count, articles}] = await Promise.all([
      api.getCategory(id),
      api.getCategories(true),
      api.getArticlesByCategory({limit, offset, categoryId: id}),
    ]);

    const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
    const {user} = req.session;

    res.render(`articles-by-category`, {user, headCategory, categories, articles, totalPages, page});
  } catch (e) {
    const {response} = e;
    if (response && response.status === 404) {
      res.render(`errors/400`);
    } else {
      res.render(`errors/500`);
    }
  }
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const categories = await api.getCategories();
  const {user} = req.session;

  res.render(`post-form`, {user, categories, editMode: false, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  const allCategories = await api.getCategories();

  const categories = article.categories.map((item) => item.id);
  article.categories = categories;
  const {user} = req.session;

  res.render(`post-form`, {user, article, categories: allCategories, editMode: true, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  try {
    const article = await api.getArticle(id); // Если id невалидный, запрос будет только один
    const [comments, categories] = await Promise.all([
      api.getArticleComments(id),
      api.getArticleCategories(id),
    ]);

    const {user} = req.session;

    res.render(`post`, {user, article, comments, categories, csrfToken: req.csrfToken()});
  } catch (e) {
    const {response} = e;
    if (response.status === 404) {
      res.render(`errors/400`);
    } else {
      res.render(`errors/500`);
    }
  }
});

articlesRouter.post(`/add`, upload.single(`picture`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;

  const articleData = {
    picture: file ? file.filename : null,
    announce: body.announce,
    fullText: body.fullText,
    title: body.title,
    createdDate: body.createdDate,
    categories: Array.isArray(body.categories) ? body.categories : [body.categories],
    authorId: user.id
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    const errors = error.response.data.messages;
    const categories = await api.getCategories();

    res.render(`post-form`, {user, article: articleData, categories, errors, editMode: false, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`picture`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  let resultCategories = null;
  const {user} = req.session;

  if (body.categories) {
    resultCategories = Array.isArray(body.categories) ? body.categories : [body.categories];
  }

  const articleData = {
    picture: file
      ? file.filename
      : body.picture,
    announce: body.announce,
    fullText: body.fullText,
    title: body.title,
    createdDate: body.createdDate,
    categories: resultCategories,
    authorId: user.id
  };

  try {
    await api.updateArticle(articleData, id);
    res.redirect(`/articles/${id}`);
  } catch (error) {
    const errors = error.response.data.messages;
    const categories = await api.getCategories();

    res.render(`post-form`, {user, article: articleData, id, categories, errors, editMode: true, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/:id`, csrfProtection, async (req, res) => {
  const {body} = req;
  const {id} = req.params;
  const {user} = req.session;

  const comment = {
    text: body.text,
    authorId: user.id
  };

  let article = null;
  let comments = null;
  let categories = null;
  try {
    const createdComment = await api.createComment(comment, id);
    if (createdComment) {
      article = await api.getArticle(id);
      [comments, categories] = await Promise.all([
        api.getArticleComments(id),
        api.getArticleCategories(id),
      ]);
    }

    res.render(`post`, {user, article, comments, categories, csrfToken: req.csrfToken()});
  } catch (error) {
    const errors = error.response.data.messages;
    article = await api.getArticle(id);
    [comments, categories] = await Promise.all([
      api.getArticleComments(id),
      api.getArticleCategories(id),
    ]);

    res.render(`post`, {user, article, comments, categories, errors, text: comment.text, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;
