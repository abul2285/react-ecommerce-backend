const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const {
  create,
  read,
  list,
  update,
  remove,
  getSubs,
} = require('../controllers/category');

const categoryRouter = express.Router();

categoryRouter.route('/category').post(authCheck, isAdmin, create);
categoryRouter.route('/category/subs/:_id').get(getSubs);
categoryRouter.route('/categories').get(list);
categoryRouter
  .route('/category/:slug')
  .get(read)
  .put(authCheck, isAdmin, update)
  .delete(authCheck, isAdmin, remove);

module.exports = categoryRouter;
