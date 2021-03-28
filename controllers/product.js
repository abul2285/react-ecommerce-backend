const Product = require('../models/product');
const slugify = require('slugify');
const User = require('../models/user');

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log({ error });
    res.status(400).send('Product create failed');
  }
};

exports.listAll = async (req, res) => {
  const products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']]);
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deletedProduct);
  } catch (error) {
    console.log({ error });
    res.status(404).send('Product delete failed');
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate('category')
      .populate('subs');
    res.json(product);
  } catch (error) {
    console.log({ error });
    res.status(404).send('Product not found');
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log({ error });
    return res.status(400).send('Product not found');
  }
};

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   const { sort, order, limit } = req.body;
//   const products = await Product.find({})
//     .limit(limit)
//     .populate('category')
//     .populate('subs')
//     .sort([[sort, order]]);
//   res.json(products);
// };

// WITH PAGINATION
exports.list = async (req, res) => {
  const { sort, order, page } = req.body;
  const currentPage = page || 1;
  const perPage = 3;
  const products = await Product.find({})
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .populate('category')
    .populate('subs')
    .sort([[sort, order]]);
  res.json(products);
};

exports.productsCount = async (_, res) => {
  const count = await Product.estimatedDocumentCount();
  res.json(count);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const user = await User.findOne({ email: req.user.email });
  const { star } = req.body;

  const hasStar = product.ratings.find(
    (r) => r.postedBy.toString() === user._id.toString()
  );

  if (!hasStar) {
    const addedStar = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    res.json(addedStar);
  } else {
    const updateStar = await Product.updateOne(
      { ratings: { $elemMatch: hasStar } },
      {
        $set: { 'ratings.$.star': star },
      },
      {
        new: true,
      }
    ).exec();
    res.json(updateStar);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();

  res.json(related);
};

// SEARCH / FILTER

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('sub', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  const products = await Product.find({
    price: { $gte: price[0], $lte: price[1] },
  })
    .populate('category', '_id name')
    .populate('sub', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handleCategory = async (req, res, category) => {
  const products = await Product.find({
    category,
  })
    .populate('category', '_id name')
    .populate('sub', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handleSub = async (req, res, sub) => {
  const products = await Product.find({
    subs: sub,
  })
    .populate('category', '_id name')
    .populate('sub', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handleStars = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        floorAvarage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    { $match: { floorAvarage: stars } },
  ]).exec((err, aggreate) => {
    if (err) console.log('aggreate error', err);
    Product.find({
      _id: aggreate,
    })
      .populate('category', '_id name')
      .populate('sub', '_id name')
      .populate('postedBy', '_id name')
      .exec((err, products) => {
        if (err) console.log('products aggreate error', err);
        res.json(products);
      });
  });
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({
    shipping,
  })
    .populate('category', '_id name')
    .populate('sub', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({
    color,
  })
    .populate('category', '_id name')
    .populate('sub', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};
const handleBrand = async (req, res, brand) => {
  const products = await Product.find({
    brand,
  })
    .populate('category', '_id name')
    .populate('sub', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    brand,
    color,
    shipping,
  } = req.body;

  if (query) {
    await handleQuery(req, res, query);
  }
  if (price) {
    await handlePrice(req, res, price);
  }
  if (category) {
    await handleCategory(req, res, category);
  }
  if (sub) {
    await handleSub(req, res, sub);
  }
  if (stars) {
    handleStars(req, res, stars);
  }
  if (shipping) {
    await handleShipping(req, res, shipping);
  }
  if (color) {
    await handleColor(req, res, color);
  }
  if (brand) {
    await handleBrand(req, res, brand);
  }
};
