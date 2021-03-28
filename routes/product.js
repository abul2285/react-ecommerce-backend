const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const {
  create,
  listAll,
  list,
  remove,
  productsCount,
  read,
  update,
  productStar,
  listRelated,
  searchFilters,
} = require('../controllers/product');

const productRouter = express.Router();

productRouter.route('/product').post(authCheck, isAdmin, create);
// RATING
productRouter.route('/product/star/:productId').put(authCheck, productStar);
// RALATED
productRouter.route('/product/related/:productId').get(listRelated);
productRouter
  .route('/product/:slug')
  .get(read)
  .delete(authCheck, isAdmin, remove)
  .put(authCheck, isAdmin, update);
productRouter.route('/products/total').get(productsCount);
productRouter.route('/products/:count').get(listAll);
productRouter.route('/products').post(list);
// SEARCH /FILTER
productRouter.route('/search/filters').post(searchFilters);

module.exports = productRouter;
