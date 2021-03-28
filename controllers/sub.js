const Sub = require('../models/sub');
const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await new Sub({
      name,
      parent,
      slug: slugify(name),
    }).save();
    res.json(subCategory);
  } catch (error) {
    console.log({ error });
    res.status(403).send('create  subCategory failed');
  }
};

exports.list = async (req, res) =>
  res.json(await Sub.find().sort({ createdAt: -1 }));

exports.read = async (req, res) => {
  try {
    const sub = await Sub.findOne({ slug: req.params.slug }).exec();
    const products = await Product.find({ subs: sub }).exec();
    res.json({ sub, products });
  } catch (error) {
    console.log({ error });
    res.status(403).send('get  subCategory failed');
  }
};

exports.update = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(subCategory);
  } catch (error) {
    console.log({ error });
    res.status(403).send('update  sub category failed');
  }
};

exports.remove = async (req, res) => {
  try {
    const subCategory = await Sub.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(subCategory);
  } catch (error) {
    console.log({ error });
    res.status(403).send('delete  subCategory failed');
  }
};
