const Category = require('../models/category');
const Product = require('../models/product');
const Sub = require('../models/sub');
const slugify = require('slugify');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  } catch (error) {
    console.log({ error });
    res.status(403).send('create category failed');
  }
};

exports.list = async (req, res) =>
  res.json(await Category.find().sort({ createdAt: -1 }));

exports.read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category })
      .populate('category')
      .exec();
    res.json({ category, products });
  } catch (error) {
    console.log({ error });
    res.status(403).send('get category failed');
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    console.log({ error });
    res.status(403).send('update category failed');
  }
};

exports.remove = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(category);
  } catch (error) {
    console.log({ error });
    res.status(403).send('delete category failed');
  }
};

exports.getSubs = async (req, res) =>
  res.json(await Sub.find({ parent: req.params._id }));
