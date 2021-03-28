const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const { create, read, list, update, remove } = require('../controllers/sub');

const subCategoryRouter = express.Router();

subCategoryRouter.route('/sub').post(authCheck, isAdmin, create);
subCategoryRouter.route('/subs').get(list);
subCategoryRouter
  .route('/sub/:slug')
  .get(read)
  .put(authCheck, isAdmin, update)
  .delete(authCheck, isAdmin, remove);

module.exports = subCategoryRouter;
