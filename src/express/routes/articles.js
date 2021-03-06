'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {Router} = require(`express`);
const data = require(`../templates/data`);
const api = require(`../api`).getAPI();

const router = Router;
const articlesRouter = router();

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`, {...data});
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`post-form`, {...data, categories, editMode: false});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  const categories = await api.getCategories();
  res.render(`post-form`, {...data, article, categories, editMode: true});
});

articlesRouter.get(`/:id`, (req, res) => {
  res.render(`post`, {...data, comments: [1], postPicture: true, isInputEmpty: true});
});

articlesRouter.post(`/add`, upload.single(`image`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    image: file ? file.filename : null,
    announce: body.announce,
    fullText: body.fullText,
    title: body.title,
    createdDate: `${body.createdDate} ${new Date().toLocaleTimeString()}`, // TODO временный костыль на отображение времени
    category: body.category.filter(Boolean)
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    const categories = await api.getCategories();
    res.render(`ticket-edit`, {
      ...data,
      article: articleData,
      categories,
      editMode: true,
    });
  }
});

module.exports = articlesRouter;
