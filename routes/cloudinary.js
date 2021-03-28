const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const { upload, remove } = require('../controllers/cloudinary');

const cloudinaryRouter = express.Router();

cloudinaryRouter.route('/uploadimages').post(authCheck, isAdmin, upload);
cloudinaryRouter
  .route('/removeimage/:public_id')
  .delete(authCheck, isAdmin, remove);

module.exports = cloudinaryRouter;
